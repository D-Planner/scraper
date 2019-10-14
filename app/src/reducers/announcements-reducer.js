import { ActionTypes } from '../actions';

const initialState = {
  announcements: [{
    text: '----',
    link: '/',
  }],
  currentAnnouncement: {
    text: '----',
    link: '/',
  },
};

const announcementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_ANNOUNCEMENTS:
      return Object.assign({}, state, { announcements: action.payload, currentAnnouncement: action.payload[0] });
    default:
      return state;
  }
};

export default announcementsReducer;
