// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import App from './components/App.jsx';
import store from './store';
/* eslint-disable-next-line no-unused-vars */
import i18n from './i18n';

const socket = io(process.env.API_URL);

const InitializedApp = () => (
  <Provider store={store}>
    <App socket={socket} />
  </Provider>
);

export default InitializedApp;
