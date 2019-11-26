import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  current: null,
  errorMessage: null, // ''?
  prevCourses: null,
};

const plansReducer = (state = initialState, action) => {
  const current = Object.assign({}, state.current);
  let all = Object.assign({}, current.all);
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
      current.terms = state.current.terms.map((y) => {
        return y.map((t) => {
          if (t._id === action.payload.termID) {
            t.courses.push(action.payload.userCourse);
          }
          return t;
        });
      });
      // eslint-disable-next-line no-case-declarations
      all = state.all.map((p) => {
        if (p.id === state.current.id) {
          p.terms = p.terms.map((t) => {
            if (t._id === action.payload.termID) {
              t.courses.push(action.payload.userCourse);
            }
            return t;
          });
        }
        return p;
      });
      return Object.assign({}, state, { current, all });
    case ActionTypes.REMOVE_COURSE_FROM_PLAN:
      current.terms = state.current.terms.map((y) => {
        return y.map((t) => {
          t.courses = t.courses.filter((c) => {
            return c.id.toString() !== action.payload.userCourse.toString();
          });
          return t;
        });
      });
      return Object.assign({}, state, { current });
    case ActionTypes.FETCH_PREV_COURSES:
      return Object.assign({}, state, { prevCourses: action.payload });
    case ActionTypes.SET_FULFILLED_STATUS:
      // Fill this in
      current.terms = state.current.terms.map((y) => {
        return y.map((t) => {
          t.courses = t.courses.map((c) => {
            if (c.id === action.payload.id) return { ...c, fulfilledStatus: action.payload.value };
            return c;
          });
          return t;
        });
      });
      all = state.all.map((p) => {
        p.terms = p.terms.map((t) => {
          t.courses = t.courses.map((c) => {
            if (c.id === action.payload.id) return { ...c, fulfilledStatus: action.payload.value };
            return c;
          });
          return t;
        });
        return p;
      });
      console.log(current);
      return Object.assign({}, state, { current, all });
    case ActionTypes.ADD_PLACEHOLDER_COURSE_TO_PLAN:
      // eslint-disable-next-line no-case-declarations
      const placeholder = { placeholder: action.payload.placeholderCourse };
      current.terms = state.current.terms.map((y) => {
        return y.map((t) => {
          if (t._id === action.payload.termID) {
            t.courses.push(placeholder);
          }
          return t;
        });
      });
      // eslint-disable-next-line no-case-declarations
      all = state.all.map((p) => {
        if (p.id === state.current.id) {
          p.terms = p.terms.map((t) => {
            if (t._id === action.payload.termID) {
              t.courses.push(placeholder);
            }
            return t;
          });
        }
        return p;
      });
      return Object.assign({}, state, { current, all });
    case ActionTypes.REMOVE_PLACEHOLDER_COURSE_FROM_PLAN:
      current.terms = state.current.terms.map((y) => {
        return y.map((t) => {
          if (t._id === action.payload.termID) {
            const remove_index = t.courses.findIndex(c => c.placeholder === action.payload.placeholderCourse);
            t.courses = t.courses.filter((c, i) => i !== remove_index);
            console.log(t.courses);
          }
          return t;
        });
      });
      return Object.assign({}, state, { current });
    default:
      return state;
  }
};

export default plansReducer;
