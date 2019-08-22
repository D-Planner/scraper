import { ActionTypes } from '../actions';

const initialState = {
  isDragging: false,
};

const dragReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.BEGIN_DRAG:
      return Object.assign({}, state, { isDragging: true });
    case ActionTypes.END_DRAG:
      return Object.assign({}, state, { isDragging: false });
    default:
      return state;
  }
};

export default dragReducer;
