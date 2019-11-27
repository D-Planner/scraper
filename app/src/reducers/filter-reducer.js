import { ActionTypes } from '../actions';
import { GenEds } from '../constants';


const initialState = {
  distribs: Object.values(GenEds).filter(e => (e.name !== 'W' && e.name !== 'CI' && e.name !== 'NW')).map((e) => { return { name: e.name, checked: false }; }),
  wcs: Object.values(GenEds).filter(e => (e.name === 'W' || e.name === 'CI' || e.name === 'NW')).map((e) => { return { name: e.name, checked: false }; }),
  offered: [''].reduce((acc, cur) => {
    const returnVal = [];
    for (let i = 0; i < 15; i += 1) {
      returnVal.push({ termIndex: i, checked: false });
    }
    return returnVal;
  }, []),
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERS:
      return action.payload;
    case ActionTypes.CLEAR_FILTERS:
      return {
        distribs: Object.values(GenEds).filter(e => (e.name !== 'W' && e.name !== 'CI' && e.name !== 'NW')).map((e) => { return { name: e.name, checked: false }; }),
        wcs: Object.values(GenEds).filter(e => (e.name === 'W' || e.name === 'CI' || e.name === 'NW')).map((e) => { return { name: e.name, checked: false }; }),
        offered: new Array(15).map(i => ({ termIndex: i, checked: false })),
      };
    default:
      return state;
  }
};

export default filterReducer;
