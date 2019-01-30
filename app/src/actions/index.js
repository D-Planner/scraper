import axios from 'axios';

const COURSES_URL = 'https://limitless-forest-87283.herokuapp.com';

export const ActionTypes = {
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEATH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_COURSES: 'FETCH_COURSES',
};

export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

const ROOT_URL = 'http://localhost:9090/api';

export function signinUser({ email, password }, history) {
  const fields = { email, password };

  axios.post(`${ROOT_URL}/signin`, fields).then((response) => {
    // do something with response.data  (some json)
    return (dispatch) => {
      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      history.push('/');
    };
  }).catch((error) => {
    return (dispatch) => {
      dispatch(authError(`Sign In Failed: ${error.response.data}`));
    };
  });
}

export function signupUser({ email, password, username }, history) {
  const fields = { email, password, username };

  axios.post(`${ROOT_URL}/signup`, fields).then((response) => {
    return (dispatch) => {
      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      history.push('/');
    };
  }).catch((error) => {
    return (dispatch) => {
      dispatch(authError(`Sign In Failed: ${error.response.data}`));
    };
  });
}

export function signoutUser(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
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
