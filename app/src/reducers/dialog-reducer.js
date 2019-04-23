import { ActionTypes } from '../actions';

const initialState = {
  current: null,
};

const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_DIALOG:
      return Object.assign({}, state, { current: action.payload });
    case ActionTypes.HIDE_DIALOG:
      return Object.assign({}, state, { current: null });
    default:
      return state;
  }
};

export default dialogReducer;
