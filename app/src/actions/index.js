import axios from 'axios';

const COURSES_URL = 'https://limitless-forest-87283.herokuapp.com';

export const ActionTypes = {
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEATH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_PLANS: 'FETCH_PLANS',
  FETCH_PLAN: 'FETCH_PLAN',
  FETCH_COURSES: 'FETCH_COURSES',
};

export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

const ROOT_URL = 'http://localhost:9090';

function normalizePlanName(planName) {
  return planName.toLowerCase().replace(/ /g, '-');
}

export function signinUser({ email, password }, history) {
  const fields = { email, password };
  return (dispatch) => {
    axios.post(`${ROOT_URL}/auth/signin`, fields).then((response) => {
    // do something with response.data  (some json)
      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      history.push('/');
    }).catch((error) => {
      dispatch(authError(`Sign In Failed: ${error.response.data}`));
    });
  };
}

export function signupUser({ email, password, username }, history) {
  const fields = { email, password, username };

  return (dispatch) => {
    axios.post(`${ROOT_URL}/auth/signup`, fields).then((response) => {
      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      history.push('/');
    }).catch((error) => {
      dispatch(authError(`Sign In Failed: ${error.response.data}`));
    });
  };
}

export function signoutUser(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
  };
}

export function createPlan(plan, history) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  const normalizedName = normalizePlanName(plan.name);
  const toSend = {
    name: normalizedName,
    terms: plan.terms,
  };
  return (dispatch) => {
    axios.post(`${ROOT_URL}/plans`, { plan: toSend }, { headers }).then((response) => {
      history.push(`/plan/${normalizedName}`);
    });
  };
}

export function fetchPlans() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.get(`${ROOT_URL}/plans`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PLANS, payload: response.data });
    });
  };
}

export function fetchPlan(planName) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  const toSend = normalizePlanName(planName);
  return (dispatch) => {
    axios.get(`${ROOT_URL}/plans/${toSend}`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PLAN, payload: response.data });
    });
  };
}

export function fetchCourses() {
  return (dispatch) => {
    axios.get(`${COURSES_URL}/courses`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_COURSES, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}
