import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Store, AnyAction } from 'redux'

import DevTools from './DevTools'

interface RootProps {
  store: Store<any, AnyAction>
}

export default class Root extends Component<RootProps> {
  render() {
    const { store, children } = this.props

    return (
      <Provider store={store}>
        <div>
          {children}
          <DevTools />
        </div>
      </Provider>
    )
  }
}
