import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  declared: [],
  major: null,
  progress: null,
};

const majorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_MAJORS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_DECLARED:
      return Object.assign({}, state, { declared: action.payload });
    case ActionTypes.FETCH_MAJOR:
      return Object.assign({}, state, { major: action.payload });
    case ActionTypes.FETCH_PROGRESS:
      return Object.assign({}, state, { progress: action.payload });
    case ActionTypes.DECLARE_MAJOR:
      return Object.assign({}, state, { declared: action.payload });
    case ActionTypes.DROP_MAJOR:
      return Object.assign({}, state, { declared: state.declared.filter(major => major.id !== action.payload) });
    default:
      return state;
  }
};

export default majorsReducer;
