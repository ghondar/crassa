import React from 'react'
import { Route } from 'react-router-dom'
import { History, LocationState } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import loadable from '@loadable/component'

import Loading from 'components/Common/Loading'

const Dashboard = loadable(() => import(/* webpackPrefetch: true */ 'containers/Dashboard'), {
  fallback: <Loading />
})

export default (history: History<LocationState>): React.ReactNode => (
  <ConnectedRouter history={history}>
    <Route component={Dashboard} exact path='/' />
  </ConnectedRouter>
)
