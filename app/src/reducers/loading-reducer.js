import { ActionTypes } from '../actions';

const initialState = {
  loading: true,
};

const loadingReducer = (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return Object.assign({}, state, { loading: action.payload.loading });
    default:
      return state;
  }
};

export default loadingReducer;
