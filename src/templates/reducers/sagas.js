import { select, call, put } from 'redux-saga/effects'

import { Get } from 'lib/Request'

export const fetchCounter = ({ types, selectors }) => function* (addMore) {
  try {
    const status = yield select(selectors.getStatus)
    if(status !== 'READY' || addMore) {
      yield put({ type: types.FETCH_PENDING })
      const payload = yield call(Get, 'counters')

      const count = yield select(selectors.getCount)

      yield put({
        type   : types.FETCH_FULFILLED,
        payload: {
          count: payload.count + count
        }
      })
    } else {
      console.log('loaded from server')
    }
  } catch (e) {
    const { type, message, response: { data: { message: messageResponse } = {} } = {} } = e
    switch (type) {
      case 'cancel':
        yield put({ type: types.FETCH_CANCEL })
        break
      default:
        yield put({
          type : types.FETCH_FAILURE,
          error: messageResponse || message
        })
        break
    }
  }
}
