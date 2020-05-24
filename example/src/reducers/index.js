import { combineReducers } from 'redux'
import { all } from 'redux-saga/effects'
import { connectRouter } from 'connected-react-router'

import counter from './counter'

export default history => combineReducers({
  router         : connectRouter(history),
  [counter.store]: counter.reducer
})

export function* rootSaga() {
  yield all([
    ...counter.takes
  ])
}
