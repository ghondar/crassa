import React, { Component } from 'react'

export default class Loading extends Component {
  render() {
    return (
      <div
        style={{
          display       : 'flex',
          justifyContent: 'center',
          alignItems    : 'center',
          position      : 'absolute',
          right         : 0,
          left          : 0,
          top           : 0,
          bottom        : 0
        }}>
        Cargando...
      </div>
    )
  }
}
