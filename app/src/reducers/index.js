import { combineReducers } from 'redux';

import authReducer from './auth-reducer';
import coursesReducer from './courses-reducer';
import dialogReducer from './dialog-reducer';
import plansReducer from './plans-reducer';
import userReducer from './user-reducer';
import majorsReducer from './majors-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  dialog: dialogReducer,
  plans: plansReducer,
  user: userReducer,
  majors: majorsReducer,
});

export default rootReducer;
