import { ActionTypes } from '../actions';

const initialState = {
  type: null,
  options: {},
  focusOnClose: null,
};

const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_DIALOG:
      return Object.assign({}, state, { type: action.payload.type, options: action.payload.options }); // , focusOnClose: action.payload.focusOnClose
    case ActionTypes.HIDE_DIALOG:
      if (state.focusOnClose !== null) {
        console.log('focusing from action');
        console.log(state.focusOnClose);
        state.focusOnClose.current.focus();
      } else {
        console.log('state.focusOnClose === null');
      }
      return Object.assign({}, state, { type: null, options: {} });
    case ActionTypes.UPDATE_CLOSE_FOCUS:
      console.log('dialog reducer focusonclose payload');
      console.log(action.payload.focusOnClose);
      return Object.assign({}, state, { focusOnClose: action.payload.focusOnClose });
    default:
      return state;
  }
};

export default dialogReducer;
