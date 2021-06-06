// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from './components/App.jsx'
import reducers from './reducers/index.jsx';


const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('chat'),
);
