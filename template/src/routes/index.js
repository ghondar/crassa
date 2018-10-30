import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import loadable from 'loadable-components'

import Loading from 'components/Common/Loading'

const Dashboard = loadable(() => import(/* webpackChunkName: "Dashboard" */ 'containers/Dashboard'), {
  LoadingComponent: () => <Loading />,
  modules         : [ 'containers/Dashboard' ]
})

export default history => (
  <ConnectedRouter history={history}>
    <Route component={Dashboard} exact path='/' />
  </ConnectedRouter>
)
