import { take, fork } from 'redux-saga/effects'

const watchFetchCount = ({ types, sagas }) => fork(function* () {
  while (true) {
    const { addMore } = yield take(types.FETCH)
    yield fork(sagas.addCountFromServer, addMore)
  }
})

export default (duck) => [
  watchFetchCount(duck)
]
