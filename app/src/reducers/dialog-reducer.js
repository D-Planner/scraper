import { ActionTypes } from '../actions';

const initialState = {
  type: null,
  options: {},
};

const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_DIALOG:
      return Object.assign({}, state, { type: action.payload.type, options: action.payload.options });
    case ActionTypes.HIDE_DIALOG:
      return Object.assign({}, state, { type: null, options: {} });
    default:
      return state;
  }
};

export default dialogReducer;
