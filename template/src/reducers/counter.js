import base from './base'
import produce from 'immer'

export default base({
  namespace   : 'crassa',
  store       : 'counter',
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
    getCount: state => state[store].count
  }),
  creators: ({ types }) => ({
    addCount          : () => ({ type: types.ADD_COUNT }),
    removeCount       : () => ({ type: types.REMOVE_COUNT }),
    addCountFromServer: () => ({ type: types.FETCH })
  })
})
