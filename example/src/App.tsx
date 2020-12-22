import React from 'react'

import store, { history } from './store/configureStore'
import createRoutes from './routes'
import Root from './containers/Root'

const routes = createRoutes(history)

const App:  React.FC<Record<string, unknown>> = () => <Root store={store}>{routes}</Root>

export default App
