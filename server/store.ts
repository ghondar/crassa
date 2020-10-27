import { createStore, applyMiddleware, compose, Action, Store, AnyAction } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware, { END, Task, Saga } from 'redux-saga'
import { createMemoryHistory } from 'history'

import { appLib } from '../src/paths'

const { 'default': createRootReducer } = require(appLib + '/ssr/src/reducers')

// Create a store and history based on a path
const createServerStore = (path = '/') => {
  const initialState = {}
  const sagaMiddleware = createSagaMiddleware()

  // We don't have a DOM, so let's create some fake history and push the current path
  const history = createMemoryHistory({ initialEntries: [ path ] })

  // All the middlewares
  const middleware = [ sagaMiddleware, routerMiddleware(history) ]
  const composedEnhancers = compose(
    applyMiddleware(...middleware)
  )

  // Store it all
  type StoreType = Store<unknown, Action<any>> & {
    dispatch: unknown;
    runSaga?: <S extends Saga<any[]>>(saga: S, ...args: Parameters<S>) => Task;
    close?: <T extends AnyAction>(action: T) => any;
  }

  const store: StoreType = createStore(createRootReducer(history), initialState, composedEnhancers)

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  // Return all that I need
  return {
    history,
    store
  }
}

export default createServerStore
