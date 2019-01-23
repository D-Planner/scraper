import { ActionTypes } from '../actions';

const initialState = {
  all: [],
};

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_COURSES:
      return Object.assign({}, state, { all: action.payload });
    default:
      return state;
  }
};

export default coursesReducer;
