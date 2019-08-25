import { ActionTypes } from '../actions';

const initialState = {
  isDragging: false,
  dragCourse: null,
};

const dragReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.BEGIN_DRAG:
      return Object.assign({}, state, { isDragging: true, dragCourse: action.payload });
    case ActionTypes.END_DRAG:
      return Object.assign({}, state, { isDragging: false, dragCourse: null });
    default:
      return state;
  }
};

export default dragReducer;
