import { ActionTypes } from '../actions';

const initialState = {
  announcements: [{
    text: 'loading announcements...',
    link: '/',
  }],
  currentAnnouncement: {
    text: 'loading announcements...',
    link: '/',
  },
};

const announcementsReducer = (state = initialState, action) => {
  console.log('announcements reducer');
  console.log(action.payload);
  switch (action.type) {
    case ActionTypes.FETCH_ANNOUNCEMENTS:
      console.log('fetch announcements');
      return Object.assign({}, state, { announcements: action.payload, currentAnnouncement: action.payload[action.payload.length - 1] });
    case ActionTypes.FETCH_ANNOUNCEMENT:
      console.log('fetch announcement');
      return Object.assign({}, state, { currentAnnouncement: action.payload });
    case ActionTypes.DELETE_ALL_ANNOUNCEMENTS:
      console.log('delete all announcements');
      return Object.assign({}, state, { announcements: null, currentAnnouncement: null });
    case ActionTypes.NEW_ANNOUNCEMENT:
      console.log('new announcement');
      console.log(action.payload);
      return Object.assign({}, state, {}); // Object.assign({}, state, { announcements: action.payload, currentAnnouncement: action.payload[0] });
    default:
      console.log('default');
      return state;
  }
};

export default announcementsReducer;
