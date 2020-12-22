import { select, call, put, take, fork } from 'redux-saga/effects'

import { Get } from 'lib/Request'
import { DuckTypes } from 'reducers/base'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addCountFromServer = ({ types, selectors }: DuckTypes) => function* (addMore: boolean): Generator<any, any, any> {
  try {
    const status = yield select(selectors.getStatus)
    if(status !== 'READY' || addMore) {
      yield put({ type: types.FETCH_PENDING })
      const payload = yield call(Get, 'counter')

      const count = yield select(selectors.getCount)

      yield put({
        type   : types.FETCH_FULFILLED,
        payload: {
          count: payload.count + count
        }
      })
    } else {
      // eslint-disable-next-line no-restricted-syntax
      console.log('loaded from server')
    }
  } catch (e) {
    const { type, message, response: { data: { message: messageResponse } = { message: '' } } = {} } = e
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

export const watchCountServer = ({ types, sagas }: DuckTypes): unknown => fork(function* () {
  while (true) {
    const { addMore } = yield take(types.FETCH)
    yield fork(sagas.addCountFromServer, addMore)
  }
})
