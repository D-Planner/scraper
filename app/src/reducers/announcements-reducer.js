/* eslint-disable max-len */
import { ActionTypes } from '../actions';

const initialState = {
  // announcements: [{
  //   text: 'loading announcements...',
  //   link: '/',
  // }],
  currentAnnouncement: {
    text: 'loading announcements...',
    link: '/',
  },
  announcementActive: true,
};

const announcementsReducer = (state = initialState, action) => {
  // console.log('announcements reducer');
  // console.log('action');
  // console.log(action);
  switch (action.type) {
    case ActionTypes.FETCH_CURRENT_ANNOUNCEMENT:
      console.log('fetch current announcement', action.payload);
      return Object.assign({}, state, action.payload != null ? { currentAnnouncement: action.payload } : { announcementActive: false });
    case ActionTypes.FETCH_ANNOUNCEMENT:
      console.log('fetch announcement');
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.DELETE_ALL_ANNOUNCEMENTS:
      console.log('delete all announcements');
      return Object.assign({}, state, { currentAnnouncement: null });
    case ActionTypes.NEW_ANNOUNCEMENT:
      console.log('new announcement');
      console.log(action.payload);
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.UPDATE_ANNOUNCEMENT:
      console.log('update announcements');
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.DELETE_ANNOUNCEMENT:
      console.log('delete announcement');
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.DISABLE_ANNOUNCEMENT:
      return Object.assign({}, state, { announcementActive: action.payload });
    default:
      // console.log('default');
      return state;
  }
};

export default announcementsReducer;
