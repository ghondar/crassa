import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import loadable from '@loadable/component';
import Loading from "../components/Common/Loading";
const Dashboard = loadable(() => import("../containers/Dashboard"), {
    fallback: React.createElement(Loading, null)
});
export default (history) => (React.createElement(ConnectedRouter, { history: history },
    React.createElement(Route, { component: Dashboard, exact: true, path: '/' })));
