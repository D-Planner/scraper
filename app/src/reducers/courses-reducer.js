import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  results: [],
  resultStamp: 0,
  bookmarks: [],
};

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.DEAUTH_USER:
      return initialState;
    case ActionTypes.FETCH_COURSES:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.COURSE_SEARCH:
      if ((action.stamp - state.resultStamp) < -1) return state;
      else return Object.assign({}, state, { results: action.payload });
    case ActionTypes.STAMP_INCREMENT:
      return Object.assign({}, state, { resultStamp: action.payload });
    case ActionTypes.CLEAR_SEARCH:
      return Object.assign({}, state, { all: [], results: [], resultStamp: 0 });
    case ActionTypes.FETCH_BOOKMARKS:
      return Object.assign({}, state, { bookmarks: action.payload });
    case ActionTypes.RANDOM_COURSE:
      return Object.assign({}, state, { random_course: action.payload });
    default:
      return state;
  }
};

export default coursesReducer;
