import produce from 'immer'

import base, { DuckTypes, DuckInitialState } from 'reducers/base'
import { addCountFromServer, watchCountServer } from './sagas'

const initialState = {
  count: 0
}

export type Counter = DuckInitialState & typeof initialState

export type Action = {
  payload: Counter;
  type: string;
}

export default base({
  initialState,
  namespace: 'crassa',
  store    : 'counter'
}).extend({
  creators: ({ types }: DuckTypes) => ({
    addCount          : () => ({ type: types.ADD_COUNT }),
    addCountFromServer: (addMore: boolean) => ({ addMore, type: types.FETCH }),
    removeCount       : () => ({ type: types.REMOVE_COUNT })
  }),
  reducer: (state: Counter, action: Action, { types }: DuckTypes) =>
    produce<Counter>(state, (draft: Counter) => {
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
  sagas: {
    addCountFromServer
  },
  selectors: ({ store }: DuckTypes) => ({
    getCount : (state: Counter) => state[store].count,
    getStatus: (state: Counter) => state[store].status
  }),
  takes: (duck: DuckTypes) => [
    watchCountServer(duck)
  ],
  types: [ 'ADD_COUNT', 'REMOVE_COUNT' ]
})
