import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
export default class Root extends Component {
    render() {
        const { store, children } = this.props;
        return (React.createElement(Provider, { store: store },
            React.createElement("div", null,
                children,
                React.createElement(DevTools, null))));
    }
}
