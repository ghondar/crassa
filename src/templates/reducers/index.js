import { WAIT_FOR_ACTION } from 'redux-wait-for-action'
import produce from 'immer'

import base from 'reducers/base'
import * as sagas from './sagas'
import takes from './takes'

export default base({
  namespace   : 'crassa',
  store       : '{-- name --}',
  initialState: {
    count: 0
  }
}).extend({
  types  : [ 'ADD_COUNT', 'REMOVE_COUNT' ],
  reducer: (state, action, { types }) =>
    produce(state, draft => {
      switch (action.type) {
        case types.ADD_COUNT:
          draft.count++

          return
        case types.REMOVE_COUNT:
          draft.count--

          return
        default:
          return
      }
    }),
  selectors: ({ store }) => ({
    getCount : state => state[store].count,
    getStatus: state => state[store].status
  }),
  creators: ({ types }) => ({
    addCount          : () => ({ type: types.ADD_COUNT }),
    removeCount       : () => ({ type: types.REMOVE_COUNT }),
    addCountFromServer: addMore => ({ type: types.FETCH, [WAIT_FOR_ACTION]: types.FETCH_FULFILLED, addMore })
  }),
  sagas,
  takes
})
