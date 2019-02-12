import { combineReducers } from 'redux';

import authReducer from './auth-reducer';
import coursesReducer from './courses-reducer';
import plansReducer from './plans-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  plans: plansReducer,
});

export default rootReducer;
