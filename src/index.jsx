// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import App from './components/App.jsx'
import { store } from './store';
import i18n from './i18n.js';


render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App/>
    </I18nextProvider>
  </Provider>,
  document.getElementById('chat'),
);
