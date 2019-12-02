import { ActionTypes } from '../actions';

const initialState = {
  pressedKey: '',
  pressedModifier: '',
};

const keyEventReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_PRESSED_KEY:
      console.log(`Pressed key '${action.payload}'`);
      if (action.payload === 'Control' || action.payload === 'Shift' || action.payload === 'Alt') {
        return Object.assign({}, state, { pressedModifier: action.payload });
      } else {
        return Object.assign({}, state, { pressedKey: action.payload });
      }
    case ActionTypes.REMOVE_PRESSED_KEY:
      console.log(`Released key '${action.payload}'`);
      if (action.payload === 'Control' || action.payload === 'Shift' || action.payload === 'Alt') {
        return Object.assign({}, state, { pressedModifier: '' });
      } else {
        return Object.assign({}, state, { pressedKey: '' });
      }
    default:
      return state;
  }
};

export default keyEventReducer;
