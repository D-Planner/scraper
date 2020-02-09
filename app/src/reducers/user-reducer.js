import { ActionTypes } from '../actions';

const initialState = {
  current: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER:
      return Object.assign({}, state, { current: action.payload });
    case ActionTypes.DEAUTH_USER:
      return Object.assign({}, state, { current: {} });
    default:
      return state;
  }
};

export default userReducer;
