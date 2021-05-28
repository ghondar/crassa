import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import loadable from '@loadable/component'

import Loading from 'components/Common/Loading'

const Dashboard = loadable(async () => {
  const { 'default': AsyncDashboard } = await import(/* webpackPrefetch: true */ 'containers/Dashboard')

  return props => <AsyncDashboard {...props} />
}, {
  ssr     : true,
  fallback: <Loading />
})

export default history => {
  return (
    <ConnectedRouter history={history}>
      <Route component={Dashboard} exact path='/' />
    </ConnectedRouter>
  )}
