import axios from 'axios';

const COURSES_URL = 'https://limitless-forest-87283.herokuapp.com';

export const ActionTypes = {
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEATH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_PLANS: 'FETCH_PLANS',
  FETCH_PLAN: 'FETCH_PLAN',
  DELETE_PLAN: 'DELETE_PLAN',
  FETCH_COURSES: 'FETCH_COURSES',
  FETCH_USER: 'FETCH_USER',
};

export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

const ROOT_URL = 'http://localhost:9090';

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
  return (dispatch) => {
    axios.post(`${ROOT_URL}/plans`, { plan }, { headers }).then((response) => {
      console.log(response);
      history.push(`/plan/${response.data.id}`);
    }).catch((err) => {
      console.log(err);
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
    }).catch((err) => {
      console.log(err);
    });
  };
}

export function fetchPlan(planId) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.get(`${ROOT_URL}/plans/${planId}`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PLAN, payload: response.data });
    }).catch((err) => {
      console.log(err);
    });
  };
}

export function deletePlan(id, history) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/plans/${id}`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.DELETE_PLAN });
      history.push('/');
    }).catch((error) => {
      console.log(error);
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

export function fetchUser(userID) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/${userID}`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_USER, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function addToBucket(courseID) {
  return (dispatch) => {
    if (localStorage.getItem('bucket') === null) {
      const bucket = [];

      localStorage.setItem('bucket', JSON.stringify(bucket));
    }

    const stored = JSON.parse(localStorage.getItem('bucket'));

    const course = { id: courseID };

    stored.push(course);

    localStorage.setItem('bucket', JSON.stringify(stored));

    const result = JSON.parse(localStorage.getItem('students'));

    console.log(result);
  };
}
