import { ActionTypes } from '../actions';

const initialState = {
  all: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER:
      return Object.assign({}, state, { all: action.payload });
    default:
      return state;
  }
};

export default userReducer;
