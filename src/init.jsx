// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import React from 'react';
import { render } from 'react-dom';

import App from './components/App.jsx';

export default () => render(
  <App />,
  document.getElementById('chat'),
);
