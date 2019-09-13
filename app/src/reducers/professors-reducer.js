import { ActionTypes } from '../actions';

const initialState = {
  professor: {},
};

const professorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PROFESSOR:
      return Object.assign({}, state, { professor: action.payload });
    default:
      return state;
  }
};

export default professorReducer;
