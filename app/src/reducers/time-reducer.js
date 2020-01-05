import { ActionTypes } from '../actions';

const initialState = {
  currTerm: {
    year: new Date().getFullYear().toString().substring(2, 4),
    term: '-',
    start: new Date(),
    end: new Date(),
  },
  nextTerm: {
    year: new Date().getFullYear().toString().substring(2, 4),
    term: '-',
  },
};

const timeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TIME:
      action.payload.currTerm.start = new Date(action.payload.currTerm.start);
      action.payload.currTerm.end = new Date(action.payload.currTerm.end);
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export default timeReducer;
