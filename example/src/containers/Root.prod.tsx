import React from 'react'
import { Provider } from 'react-redux'

const Root = ({ store, children }: { store: any, children: any}) => {
  return (
    <Provider store={store}>{children}</Provider>
  )
}

export default Root
