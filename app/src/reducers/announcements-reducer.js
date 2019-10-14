import { ActionTypes } from '../actions';

const initialState = {
  announcements: [{
    text: '----',
    link: '/',
  }],
};

const announcementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_ANNOUNCEMENTS:
      return Object.assign({}, state, { announcements: action.payload });
    default:
      return state;
  }
};

export default announcementsReducer;
