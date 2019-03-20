import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import createReduxWaitForMiddleware from 'redux-wait-for-action'
import { createMemoryHistory } from 'history'

import { appSrc } from '../src/paths'

const createRootReducer = require(appSrc + '/reducers').default
const rootSaga = require(appSrc + '/sagas').default

// Create a store and history based on a path
const createServerStore = (path = '/') => {
  const initialState = {}
  const sagaMiddleware = createSagaMiddleware()

  // We don't have a DOM, so let's create some fake history and push the current path
  const history = createMemoryHistory({ initialEntries: [ path ] })

  // All the middlewares
  const middleware = [ sagaMiddleware, routerMiddleware(history) ]
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    applyMiddleware(createReduxWaitForMiddleware())
  )

  // Store it all
  const store = createStore(createRootReducer(history), initialState, composedEnhancers)
  sagaMiddleware.run(rootSaga)

  // Return all that I need
  return {
    history,
    store
  }
}

export default createServerStore
