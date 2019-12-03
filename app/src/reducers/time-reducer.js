import { ActionTypes } from '../actions';

const initialState = {
  currTerm: {
    year: 19,
    term: 'F',
  },
  nextTerm: {
    year: 20,
    term: 'W',
  },
};

const timeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TIME:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export default timeReducer;
