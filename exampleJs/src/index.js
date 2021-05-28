import React from 'react'
import ReactDOM from 'react-dom'
import { loadableReady } from '@loadable/component'

import App from './App'

if(module.hot) module.hot.accept()

const render = (Component, type = 'render') => {
  ReactDOM[type](<Component />,
    document.getElementById('root')
  )
}

if(process.env.NODE_ENV === 'production')
  loadableReady(() => {
    render(App, 'hydrate')
  })
else render(App)
