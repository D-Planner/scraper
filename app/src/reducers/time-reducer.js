import { ActionTypes } from '../actions';

const initialState = {
  currTerm: {
    year: new Date().getFullYear().toString().substring(2, 4),
    term: '-',
  },
  nextTerm: {
    year: new Date().getFullYear().toString().substring(2, 4),
    term: '-',
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
