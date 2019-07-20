import { combineReducers } from 'redux';

import authReducer from './auth-reducer';
import coursesReducer from './courses-reducer';
import dialogReducer from './dialog-reducer';
import plansReducer from './plans-reducer';
import userReducer from './user-reducer';
import majorReducer from './majors-reducer';
import timeReducer from './time-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  dialog: dialogReducer,
  majors: majorReducer,
  plans: plansReducer,
  user: userReducer,
  time: timeReducer,
});

export default rootReducer;
