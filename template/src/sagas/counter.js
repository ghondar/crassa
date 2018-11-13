import { select, call, put, takeEvery } from 'redux-saga/effects'
import { Get } from 'lib/Request'

import counterDucks from 'reducers/counter'

const { types, selectors } = counterDucks

function* addCountFromServer() {
  try {
    yield put({ type: types.FETCH_PENDING })

    const payload = yield call(Get, 'counter')
    const count = yield select(selectors.getCount)

    yield put({
      type   : types.FETCH_FULFILLED,
      payload: {
        count: payload.count + count
      }
    })
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

export default [ takeEvery(types.FETCH, addCountFromServer) ]
