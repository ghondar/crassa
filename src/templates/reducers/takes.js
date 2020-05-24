import { take, fork } from 'redux-saga/effects'

const watchFetch{-- capitalizeName --}s = ({ types, sagas }) => fork(function* () {
  while (true) {
    const { addMore } = yield take(types.FETCH_{-- upperName --}S)
    yield fork(sagas.fetch{-- capitalizeName --}s, addMore)
  }
})

const watchFetch{-- capitalizeName --} = ({ types, sagas }) => fork(function* () {
  while (true) {
    const { id } = yield take(types.FETCH_{-- upperName --})
    yield fork(sagas.fetch{-- capitalizeName --}, id)
  }
})

const watchPost{-- capitalizeName --} = ({ types, sagas }) => fork(function* () {
  while (true) {
    const { {-- name --} } = yield take(types.POST)
    yield fork(sagas.post{-- capitalizeName --}, {-- name --})
  }
})

const watchUpdate{-- capitalizeName --} = ({ types, sagas }) => fork(function* () {
  while (true) {
    const { id, {-- name --} } = yield take(types.UPDATE)
    yield fork(sagas.update{-- capitalizeName --}, id, {-- name --})
  }
})

const watchDelete{-- capitalizeName --} = ({ types, sagas }) => fork(function* () {
  while (true) {
    const { id } = yield take(types.DELETE)
    yield fork(sagas.delete{-- capitalizeName --}, id)
  }
})

export default duck => [
  watchFetch{-- capitalizeName --}s(duck),
  watchFetch{-- capitalizeName --}(duck),
  watchPost{-- capitalizeName --}(duck),
  watchUpdate{-- capitalizeName --}(duck),
  watchDelete{-- capitalizeName --}(duck)
]
