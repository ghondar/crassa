import produce from 'immer'

import base from 'reducers/base'
import * as sagas from './sagas'
import takes from './takes'

const {-- name --}Ducks = base({
  namespace   : 'crassa',
  store       : '{-- name --}',
  initialState: {
    docs: []
  }
}).extend({
  types  : [ 'FETCH_{-- upperName --}S', 'FETCH_{-- upperName --}', 'ADD_{-- upperName --}S' ],
  reducer: (state, action, { types }) =>
    produce(state, draft => {
      switch (action.type) {
        case types.ADD_{-- upperName --}S:
          for (key in action.payload)
            if(key === 'docs') draft[key] = draft[key].concat(action.payload[key])
            else (draft[key]) = action.payload[key]

          draft.status = statuses.READY

          return
        default:
          return
      }
    }),
  selectors: ({ store }) => ({
    get{-- capitalizeName --}s   : state => state[store].{-- name --}s,
    get{-- capitalizeName --}ById: new Duck.Selector(selectors => (state, id) =>
      selectors.get{-- capitalizeName --}s(state).find({-- name --} => id === {-- name --}.id)
    ),
    getStatus: state => state[store].status
  }),
  creators: ({ types }) => ({
    fetch{-- capitalizeName --}s: addMore => ({ type: types.FETCH_{-- upperName --}S, addMore }),
    fetch{-- capitalizeName --} : id => ({ type: types.FETCH_{-- upperName --}, id }),
    post{-- capitalizeName --}  : ({-- name --}) => ({ type: types.POST, {-- name --} }),
    update{-- capitalizeName --}: (id, {-- name --}) => ({ type: types.UPDATE, id, {-- name --} }),
    delete{-- capitalizeName --}: id => ({ type: types.DELETE, id })
  }),
  sagas,
  takes
})

export const {
  selectors: {
    get{-- capitalizeName --}s,
    get{-- capitalizeName --}ById,
    getStatus
  },
  creators: {
    fetch{-- capitalizeName --}s,
    fetch{-- capitalizeName --},
    post{-- capitalizeName --},
    update{-- capitalizeName --},
    delete{-- capitalizeName --}
  }
} = {-- name --}Ducks

export default {-- name --}Ducks
