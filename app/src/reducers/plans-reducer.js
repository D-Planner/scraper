import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  current: null,
  errorMessage: null, // ''?
  prevCourses: null,
};

const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PLANS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_PLAN:
      return Object.assign({}, state, { current: action.payload });
    case ActionTypes.UPDATE_PLAN:
      return state;
    case ActionTypes.DELETE_PLAN:
      return Object.assign({}, state, { current: null, all: state.all.filter(plan => plan.id !== action.payload) });
    case ActionTypes.ERROR_SET:
      return Object.assign({}, state, { errorMessage: action.payload });
    case ActionTypes.ERROR_CLEAR:
      return Object.assign({}, state, { errorMessage: action.payload });
    case ActionTypes.ADD_COURSE_TO_PLAN:
      // eslint-disable-next-line no-case-declarations
      let found = false;
      console.log(state);
      state.current.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === action.payload.termID) {
            t.courses.push(action.payload.userCourse);
            console.log(t);
            found = true;
          }
        });
      });
      if (found) {
        console.log(state);
        return state;
      } else return null;
    case ActionTypes.FETCH_PREV_COURSES:
      return Object.assign({}, state, { prevCourses: action.payload });
    default:
      return state;
  }
};

export default plansReducer;
