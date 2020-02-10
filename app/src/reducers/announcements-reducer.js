/* eslint-disable max-len */
import { ActionTypes } from '../actions';

const initialState = {
  currentAnnouncement: {
    text: 'loading announcements...',
    link: '/',
  },
  announcementActive: true,
};

const announcementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_CURRENT_ANNOUNCEMENT:
      return Object.assign({}, state, action.payload != null ? { currentAnnouncement: action.payload } : { announcementActive: false });
    case ActionTypes.FETCH_ANNOUNCEMENT:
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.DELETE_ALL_ANNOUNCEMENTS:
      return Object.assign({}, state, { currentAnnouncement: null });
    case ActionTypes.NEW_ANNOUNCEMENT:
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.UPDATE_ANNOUNCEMENT:
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.DELETE_ANNOUNCEMENT:
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.DISABLE_ANNOUNCEMENT:
      return Object.assign({}, state, { announcementActive: action.payload });
    default:
      return state;
  }
};

export default announcementsReducer;
