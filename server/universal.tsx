import fs from 'fs'

import React from 'react'
import { RequestHandler } from 'express'
import { HelmetProvider } from 'react-helmet-async'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'

import createServerStore from './store'

import { appBuild, appSrc, appServer } from '../src/paths'
import { resolveModule } from '../src/util'

const jsan = require('jsan')

const Root = require(appSrc + 'containers/Root').default
const createRoutes = require(appSrc + 'routes').default
let { rootSaga } = require(appSrc + 'reducers')

if(!rootSaga)
  rootSaga = require(appSrc + 'sagas').default

const universalJS = resolveModule(appServer + '/universal')

interface Payload {
  html: string;
  head: string;
  body: string;
  loadableState: string | null;
  preloadedState: string;
  isCustomState: boolean;
}

// A simple helper function to prepare the HTML markup
const prepHTML = (data: string, { html, head, body, loadableState = '', preloadedState, isCustomState }: Payload) => {
  data = data.replace('<html lang="en">', `<html ${html} >`)
  data = data.replace('</head>', `${head}</head>`)
  data = data.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  data = data.replace('</body', loadableState + '</body')
  if(!isCustomState)
    data = data.replace(
      '<script',
      `<script>window.__PRELOADED_STATE__ = ${preloadedState.replace(/</g, '\\u003c')}</script><script`
    )

  return data
}

export const createStore: RequestHandler = (req, res, next) => {
  if(req.baseUrl.indexOf('.') !== -1 || req.baseUrl.indexOf('api') !== -1 || req.baseUrl.indexOf('static') !== -1) {
    next()
  } else {
    const filePath = appBuild + '/index.html'

    // Load in our HTML file from our build
    fs.readFile(filePath, 'utf8', async (err, htmlData) => {
      // If there's an error... serve up something nasty
      if(err) {
        console.error('Read error', err)

        return res.status(404).end()
      }

      // Create a store and sense of history based on the current path
      const { store, history } = createServerStore(Object.keys(req.query).length > 0 ? req.originalUrl : req.baseUrl)

      // Set data into locals to passa another middleware
      res.locals = {
        store,
        history,
        htmlData
      }
      next()
    })
  }
}

export const universalLoader: RequestHandler = async (req, res, next) => {
  if(req.baseUrl.indexOf('.') !== -1 || req.baseUrl.indexOf('api') !== -1 || req.baseUrl.indexOf('static') !== -1) {
    next()
  } else {
    try {
      // Get store, history and html string from middleware
      const { store, history, htmlData } = res.locals
      const helmetContext: {
        helmet: any;
      } = {
        helmet: ''
      }
      // Create routes using history
      const routes = createRoutes(history, req.protocol + '://' + req.headers.host, store)

      // Get app wrapping Root (Provider redux) passing store
      const jsx = (
        <HelmetProvider context={helmetContext}>
          <Root store={store}>{routes}</Root>
        </HelmetProvider>
      )

      let extractor: ChunkExtractor | null = null

      if(process.env.NODE_ENV !== 'development') {
        const statsFile = appBuild + '/loadable-stats.json'
        extractor = new ChunkExtractor({ statsFile })
      }

      // Get loadable components tree
      const app = extractor && extractor.collectChunks(jsx)

      // Render App in React
      const task = store.runSaga(rootSaga)

      task.toPromise().then(() => {
        let prevHtml = null,
          routeMarkup = null,
          isCustomState = false
        const state = store.getState()
        const preloadedState = jsan.stringify(state)

        if(universalJS) {
          const universalProject = require(universalJS)
          if(universalProject.setRenderUniversal) {
            const { prevHtml: prevHtmlAux, renderString, customState } = universalProject.setRenderUniversal(res.locals, app, extractor)
            isCustomState = !!customState
            prevHtml = prevHtmlAux
            routeMarkup = renderString
          }
        }

        if(!prevHtml) prevHtml = htmlData
        if(!routeMarkup && app) routeMarkup = renderToString(app)

        const { helmet } = helmetContext

        // Form the final HTML response
        const html = prepHTML(prevHtml, {
          html         : helmet.htmlAttributes.toString(),
          head         : helmet.title.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString(),
          body         : routeMarkup,
          loadableState: extractor && (extractor.getScriptTags() + extractor.getStyleTags()),
          isCustomState,
          preloadedState
        })

        // Up, up, and away...
        res.send(html)
      }).catch((e: any) => {
        console.log(e)
        res.status(500).send(e.message)
      })
      app && renderToString(app)
      store.close() 
    } catch (error) {
      console.log(error)
    }
  }
}
