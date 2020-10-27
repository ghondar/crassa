import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { loadableReady } from '@loadable/component';
import App from './App';
if (module.hot)
    module.hot.accept();
const render = (Component, type = 'render') => {
    ReactDOM[type](React.createElement(AppContainer, { key: Math.random() },
        React.createElement(Component, null)), document.getElementById('root'));
};
if (process.env.NODE_ENV === 'production')
    loadableReady(() => {
        render(App, 'hydrate');
    });
else
    render(App);
if (module.hot)
    module.hot.accept('./App', () => {
        render(require('./App').default);
    });
