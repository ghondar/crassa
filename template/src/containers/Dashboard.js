import React, { Component } from 'react'
import { connect } from 'react-redux'

import counterDucks from 'reducers/counter'

class Dashboard extends Component {
  render() {
    const {
      counter: { count },
      addCount,
      removeCount,
      addCountFromServer
    } = this.props

    return (
      <div>
        <h1>Counter</h1>
        <h2>{count}</h2>
        <button onClick={() => addCount()}>Add</button>
        <button onClick={() => removeCount()}>remove</button>
        <button onClick={() => addCountFromServer()}>Add 5 From Server</button>
      </div>
    )
  }
}

export default connect(
  ({ counter }) => ({ counter }),
  {
    addCount          : counterDucks.creators.addCount,
    removeCount       : counterDucks.creators.removeCount,
    addCountFromServer: counterDucks.creators.addCountFromServer
  }
)(Dashboard)
