import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  results: [],
  bookmarks: [],
};

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_COURSES:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.COURSE_SEARCH:
      return Object.assign({}, state, { results: action.payload });
    case ActionTypes.FETCH_BOOKMARKS:
      return Object.assign({}, state, { bookmarks: action.payload });
    case ActionTypes.RANDOM_COURSE:
      return Object.assign({}, state, { random_course: action.payload });
    default:
      return state;
  }
};

export default coursesReducer;
