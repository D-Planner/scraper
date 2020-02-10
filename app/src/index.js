/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './components/App';
import DialogOrchestrator from './dialogs/dialogOrchestrator';
import { ActionTypes } from './actions';
import reducers from './reducers';

import './style/style.scss';

export const store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
));

let localStorageEnabled = true;

const getTokenFromLocalStorage = () => {
  return new Promise((resolve) => {
    resolve(localStorage.getItem('token'));
  });
};

getTokenFromLocalStorage().then((token) => {
  if (token) {
    store.dispatch({ type: ActionTypes.AUTH_USER });
  } else {
    store.dispatch({ type: ActionTypes.DEAUTH_USER }); // Backup in case of auth error
  }
}).catch((e) => {
  localStorageEnabled = false;
});

if (!localStorageEnabled) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
      <DialogOrchestrator />
    </Provider>,
    document.getElementById('root'),
  );
} else {
  ReactDOM.render(
    <div>Please enable cookies to use D-Planner.</div>, document.getElementById('root'),
  );
}
