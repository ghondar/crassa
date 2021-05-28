import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

export default class Root extends Component {
  render() {
    const { store, children } = this.props

    return <Provider store={store}>{children}</Provider>
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
