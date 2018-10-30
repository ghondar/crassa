import React from 'react'

import store, { history } from './store/configureStore'
import createRoutes from './routes'
import Root from './containers/Root'

if(process.env.NODE_ENV === 'test') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}

const routes = createRoutes(history)

export default () => <Root store={store}>{routes}</Root>
