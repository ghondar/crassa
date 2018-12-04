import fs from 'fs'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import jsan from 'jsan'
import Helmet from 'react-helmet'

import createServerStore from './store'

import { appSrc, appBuild, appServer } from '../src/paths'

const Root = require(appSrc + '/containers/Root').default
const createRoutes = require(appSrc + '/routes').default

const universalJS = appServer + '/universal.js'
const hasUniversal = fs.existsSync(universalJS)

const statsFile = appBuild + '/loadable-stats.json'

// A simple helper function to prepare the HTML markup
const prepHTML = (data, { html, head, body, loadableState, preloadedState }) => {
  data = data.replace('<html lang="en">', `<html ${html} >`)
  data = data.replace('</head>', `${head}</head>`)
  data = data.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  data = data.replace(
    '</body>',
    loadableState +
      `<script>
        window.__PRELOADED_STATE__ = ${preloadedState.replace(/</g, '\\u003c')}
      </script>` +
      '</body>'
  )

  return data
}

export function createStore(req, res, next) {
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
      const { store, history } = createServerStore(req.baseUrl)

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

export const universalLoader = async (req, res) => {
  // Get store, history and html string from middleware
  const { store, history, htmlData } = res.locals
  // Create routes using history
  const routes = createRoutes(history)
  // Get app wrapping Root (Provider redux) passing store
  const app = <Root store={store}>{routes}</Root>

  const extractor = new ChunkExtractor({ statsFile })
  // Get loadable components tree
  const jsx = extractor.collectChunks(app)

  // Let Helmet know to insert the right tags
  const helmet = Helmet.renderStatic()

  let prevHtml = null,
    routeMarkup = null

  if(hasUniversal) {
    const universalProject = require(universalJS)
    if(universalProject.setRenderUniversal) {
      const { prevHtml: prevHtmlAux, renderString } = universalProject.setRenderUniversal(htmlData, jsx, store)
      prevHtml = prevHtmlAux
      routeMarkup = renderString
    }
  }

  if(!prevHtml) prevHtml = htmlData
  // Render App in React
  if(!routeMarkup) routeMarkup = renderToString(jsx)

  const preloadedState = jsan.stringify(store.getState())

  // Form the final HTML response
  const html = prepHTML(prevHtml, {
    html         : helmet.htmlAttributes.toString(),
    head         : helmet.title.toString() + helmet.meta.toString() + helmet.link.toString(),
    body         : routeMarkup,
    loadableState: extractor.getScriptTags(),
    preloadedState
  })

  // Up, up, and away...
  res.send(html)
}
