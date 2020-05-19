import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useComponentWillMount } from 'lib/hooks'

import counterDucks from 'reducers/counter'

const { addCount, removeCount, addCountFromServer } = counterDucks.creators

export default () => {
  const dispatch = useDispatch()
  const count = useSelector(({ counter: { count } }) => count)

  useComponentWillMount(() => {
    dispatch(addCountFromServer())
  })

  return (
    <div data-testid='counter'>
      <h1>Counter</h1>
      <h2>{count}</h2>
      <button onClick={() => dispatch(addCount())}>Add</button>
      <button onClick={() => dispatch(removeCount())}>remove</button>
      <button onClick={() => dispatch(addCountFromServer(true))}>Add 5 From Server</button>
    </div>
  )
}
