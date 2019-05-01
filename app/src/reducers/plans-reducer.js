import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  current: null,
  errorMessage: '',
};

const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PLANS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_PLAN:
      return Object.assign({}, state, { current: action.payload });
    case ActionTypes.DELETE_PLAN:
      return Object.assign({}, state, { current: null, all: state.all.filter(plan => plan.id !== action.payload) });
    case ActionTypes.ERROR_SET:
      return Object.assign({}, state, { errorMessage: action.payload });
    case ActionTypes.ERROR_CLEAR:
      return Object.assign({}, state, { errorMessage: action.payload });
    default:
      return state;
  }
};

export default plansReducer;
