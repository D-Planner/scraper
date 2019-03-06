import axios from 'axios';

export const ActionTypes = {
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEATH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_PLANS: 'FETCH_PLANS',
  FETCH_PLAN: 'FETCH_PLAN',
  DELETE_PLAN: 'DELETE_PLAN',
  FETCH_USER: 'FETCH_USER',
  FETCH_COURSES: 'FETCH_COURSES',
  FETCH_BUCKET: 'FETCH_BUCKET',
  COURSE_SEARCH: 'COURSE_SEARCH',
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
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.get(`${ROOT_URL}/courses`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_COURSES, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function fetchCourse(id) { // NOTE: not set up in reducer yet because it's not used
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.get(`${ROOT_URL}/courses/${id}`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_COURSE, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function fetchUser() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.get(`${ROOT_URL}/auth`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_USER, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function fetchBucket() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.get(`${ROOT_URL}/courses/favorite`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_BUCKET, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function addCourseToFavorites(courseID) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/courses/favorite/${courseID}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).catch((error) => {
      console.log(error);
    });
  };
}


export function courseSearch(query) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/courses/search`, query, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      // there are some weird courses like "ECON 0" coming back, so I'm filtering them out for now -Adam
      dispatch({ type: ActionTypes.COURSE_SEARCH, payload: response.data.filter(c => c.number > 0) });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function updateTerm(term) {
  return (dispatch) => {
    return axios.put(`${ROOT_URL}/terms/${term.id}`, term, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).catch((err) => {
      console.log(err);
    });
  };
}
