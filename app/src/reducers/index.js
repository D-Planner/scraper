import { combineReducers } from 'redux';

import authReducer from './auth-reducer';
import coursesReducer from './courses-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
});

export default rootReducer;
