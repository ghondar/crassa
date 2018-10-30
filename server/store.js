import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import createHistory from 'history/createMemoryHistory'

import { appRootPath } from '../src/paths'

let { replaceRootPath } = require('../src/util')

replaceRootPath = replaceRootPath.bind({ appRootPath })

const reducers = require(replaceRootPath('src/reducers')).default
const rootSaga = require(replaceRootPath('src/sagas')).default

// Create a store and history based on a path
const createServerStore = (path = '/') => {
  const initialState = {}
  const sagaMiddleware = createSagaMiddleware()

  // We don't have a DOM, so let's create some fake history and push the current path
  const history = createHistory({ initialEntries: [ path ] })

  // All the middlewares
  const middleware = [ sagaMiddleware, routerMiddleware(history) ]
  const composedEnhancers = compose(applyMiddleware(...middleware))

  // Store it all
  const store = createStore(reducers, initialState, composedEnhancers)
  sagaMiddleware.run(rootSaga)

  // Return all that I need
  return {
    history,
    store
  }
}

export default createServerStore
