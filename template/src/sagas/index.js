import { all } from 'redux-saga/effects'

import counter from './counter'

export default function* rootSaga() {
  yield all([ ...counter ])
}
