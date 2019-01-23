import { combineReducers } from 'redux';
import store from '../index';
import ActionTypes from '../actions/index';

import authReducer from './auth-reducer';
import coursesReducer from './courses-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
});

const token = localStorage.getItem('token');
if (token) {
  store.dispatch({ type: ActionTypes.AUTH_USER });
}

export default rootReducer;
