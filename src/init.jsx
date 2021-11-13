// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import React from 'react';
import { render } from 'react-dom';

import { ErrorBoundary, LEVEL_WARN, Provider as RollBarProvider } from '@rollbar/react';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './store';
import { rollbarConfig } from './rollbar';
import i18n from './i18n';

export default () => render(
  <Provider store={store}>
    <RollBarProvider config={rollbarConfig}>
      <ErrorBoundary level={LEVEL_WARN}>
        <App />
      </ErrorBoundary>
    </RollBarProvider>
  </Provider>,
  document.getElementById('chat'),
);
