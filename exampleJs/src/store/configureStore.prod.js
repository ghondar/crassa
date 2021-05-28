import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createReduxWaitForMiddleware from 'redux-wait-for-action'
import createSagaMiddleware from 'redux-saga'

import createRootReducer, { rootSaga } from 'reducers'

const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__

export const history = createBrowserHistory()

const initialState = {}
const sagaMiddleware = createSagaMiddleware()
const middleware = [ sagaMiddleware, routerMiddleware(history) ]

const finalCreateStore = compose(
  applyMiddleware(...middleware),
  applyMiddleware(createReduxWaitForMiddleware())
)

const store = createStore(createRootReducer(history), preloadedState || initialState, finalCreateStore)

sagaMiddleware.run(rootSaga)

export default store
