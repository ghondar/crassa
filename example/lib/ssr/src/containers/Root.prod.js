import React from 'react';
import { Provider } from 'react-redux';
const Root = ({ store, children }) => {
    return (React.createElement(Provider, { store: store }, children));
};
export default Root;
