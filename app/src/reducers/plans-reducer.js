import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  current: null,
};

const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PLANS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_PLAN:
      return Object.assign({}, state, { current: action.payload });
    case ActionTypes.DELETE_PLAN:
      return Object.assign({}, state, { current: null });
    default:
      return state;
  }
};

export default plansReducer;