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

const token = localStorage.getItem('token');
// localStorage.removeItem('token');
if (token) {
  store.dispatch({ type: ActionTypes.AUTH_USER });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
    <DialogOrchestrator />
  </Provider>,
  document.getElementById('root'),
);
