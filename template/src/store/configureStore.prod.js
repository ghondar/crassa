import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'

import reducers from 'reducers'
import rootSaga from 'sagas'

export const history = createHistory()

const initialState = {}
const sagaMiddleware = createSagaMiddleware()
const middleware = [ sagaMiddleware, routerMiddleware(history) ]

const finalCreateStore = compose(applyMiddleware(...middleware))
const store = createStore(reducers, initialState, finalCreateStore)

sagaMiddleware.run(rootSaga)

export default store
