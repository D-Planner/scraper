import { ActionTypes } from '../actions';
import { GenEds } from '../constants';


const initialState = {
  distribs: Object.values(GenEds).filter(e => (e.name !== 'W' && e.name !== 'CI' && e.name !== 'NW')).map((e) => { return { name: e.name, checked: false }; }),
  wcs: Object.values(GenEds).filter(e => (e.name === 'W' || e.name === 'CI' || e.name === 'NW')).map((e) => { return { name: e.name, checked: false }; }),
  offeredNextTerm: false,
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERS:
      return action.payload;
    case ActionTypes.CLEAR_FILTERS:
      return {
        distribs: Object.values(GenEds).filter(e => (e.name !== 'W' && e.name !== 'CI' && e.name !== 'NW')).map((e) => { return { name: e.name, checked: false }; }),
        wcs: Object.values(GenEds).filter(e => (e.name === 'W' || e.name === 'CI' || e.name === 'NW')).map((e) => { return { name: e.name, checked: false }; }),
        offeredNextTerm: false,
      };
    default:
      return state;
  }
};

export default filterReducer;
