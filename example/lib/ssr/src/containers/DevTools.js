import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
export default createDevTools(React.createElement(DockMonitor, { changePositionKey: 'ctrl-q', defaultIsVisible: false, toggleVisibilityKey: 'ctrl-h' },
    React.createElement(LogMonitor, null)));
