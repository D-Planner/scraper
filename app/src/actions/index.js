import axios from 'axios';

const COURSES_URL = 'https://limitless-forest-87283.herokuapp.com';

export const ActionTypes = {
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEATH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_COURSES: 'FETCH_COURSES',
};

export function signinUser({ email, password }, history) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.AUTH_USER });
    localStorage.setItem('token', 'JWT');
    history.push('/');
  };
}

export function signupUser({ email, password, username }, history) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.AUTH_USER });
    localStorage.setItem('token', 'JWT');
    history.push('/');
  };
}

export function signoutUser(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
  };
}

export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
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
