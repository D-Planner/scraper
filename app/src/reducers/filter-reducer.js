import { ActionTypes } from '../actions';
import { GenEdsForDisplay as GenEds } from '../constants';

const initialState = {
  distribs: Object.values(GenEds).filter(e => (e.name !== 'W' && e.name !== 'CI' && e.name !== 'NW')).map((e, i) => {
    return {
      id: `${i}`, tag: e.name, fullName: e.fullName, name: `${e.fullName} ${e.name}`, checked: false,
    };
  }),
  wcs: Object.values(GenEds).filter(e => (e.name === 'W' || e.name === 'CI' || e.name === 'NW')).map((e, i) => {
    return {
      id: `${i}`, fullName: e.fullName, name: e.name, checked: false,
    };
  }),
  offered: [''].reduce((acc, cur) => {
    const returnVal = [{ term: 'current', check: false }];
    const terms = ['F', 'W', 'S', 'X'];
    for (let i = 0; i < terms.length; i += 1) {
      returnVal.push({ id: `${i}`, term: terms[i], checked: false });
    }
    return returnVal;
  }, []),
};

const generateInitialState = () => {
  return {
    distribs: Object.values(GenEds).filter(e => (e.name !== 'W' && e.name !== 'CI' && e.name !== 'NW')).map((e, i) => {
      return {
        id: `${i}`, tag: e.name, fullName: e.fullName, name: `${e.fullName} ${e.name}`, checked: false,
      };
    }),
    wcs: Object.values(GenEds).filter(e => (e.name === 'W' || e.name === 'CI' || e.name === 'NW')).map((e, i) => {
      return {
        id: `${i}`, fullName: e.fullName, name: e.name, checked: false,
      };
    }),
    offered: [''].reduce((acc, cur) => {
      const returnVal = [{ term: 'current', check: false }];
      const terms = ['F', 'W', 'S', 'X'];
      for (let i = 0; i < terms.length; i += 1) {
        returnVal.push({ id: `${i}`, term: terms[i], checked: false });
      }
      return returnVal;
    }, []),
  };
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.DEAUTH_USER:
      return Object.assign({}, state, initialState);
    case ActionTypes.SET_FILTERS:
      return Object.assign({}, state, { distribs: action.payload.distribs, wcs: action.payload.wcs, offered: action.payload.offered });
    case ActionTypes.CLEAR_FILTERS:
      // eslint-disable-next-line no-case-declarations
      const newInitialState = generateInitialState();
      return newInitialState;
    default:
      return initialState;
  }
};

export default filterReducer;
