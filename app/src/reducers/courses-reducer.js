import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  results: [],
};

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_COURSES:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.COURSE_SEARCH:
      return Object.assign({}, state, { results: action.payload });
    default:
      return state;
  }
};

export default coursesReducer;
