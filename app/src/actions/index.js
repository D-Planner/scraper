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
  FETCH_BOOKMARKS: 'FETCH_BOOKMARKS',
  COURSE_SEARCH: 'COURSE_SEARCH',
  SHOW_DIALOG: 'SHOW_DIALOG',
  HIDE_DIALOG: 'HIDE_DIALOG',
  ERROR_SET: 'ERROR_SET',
  ERROR_CLEAR: 'ERROR_CLEAR',
};

// ERROR HANDLINE
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

export function clearError(error) {
  return {
    type: ActionTypes.ERROR_CLEAR,
    payload: null,
  };
}

// PLANS METHODS
const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090' : 'https://dplanner-api.herokuapp.com';

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
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
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
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
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
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

export function deletePlan(id, history) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/plans/${id}`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.DELETE_PLAN, payload: id });
      history.push('/');
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
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
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
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
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
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
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

export function fetchBookmarks() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.get(`${ROOT_URL}/courses/favorite`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_BOOKMARKS, payload: response.data });
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

export function addCourseToFavorites(courseID) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/courses/favorite/${courseID}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

/**
 * Sends two axios requests, direct and indirect search, and checks which response makes sense for the user, then dispatches that response.
 * @param {*} query
 * @param {String} type
 */
export function courseSearch(query, type) {
  return (dispatch) => {
    console.log(type);
    switch (type) {
      case 'number':
        axios.get(`${ROOT_URL}/courses/${query.department}&${query.number}`, { // sends second axios request
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((response) => {
          // there are some weird courses like "ECON 0" coming back, so I'm filtering them out for now -Adam
          dispatch({ type: ActionTypes.COURSE_SEARCH, payload: response.data.filter(c => c.number > 0) });
        }).catch((error) => {
          console.log(error);
          dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
        });
        break;
      case 'department':
        axios.get(`${ROOT_URL}/courses/departments/${query.department}`, { // sends second axios request
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((response) => {
          // there are some weird courses like "ECON 0" coming back, so I'm filtering them out for now -Adam
          dispatch({ type: ActionTypes.COURSE_SEARCH, payload: response.data.filter(c => c.number > 0) });
        }).catch((error) => {
          console.log(error);
          dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
        });
        break;
      default:
        axios.post(`${ROOT_URL}/courses/search`, { query }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((response) => {
          // there are some weird courses like "ECON 0" coming back, so I'm filtering them out for now -Adam
          dispatch({ type: ActionTypes.COURSE_SEARCH, payload: response.data.filter(c => c.number > 0) });
        }).catch((error) => {
          console.log(error);
          dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
        });
    }
  };
}

export function addCourseToTerm(course, term) {
  return (dispatch) => {
    return axios.post(`${ROOT_URL}/terms/${term.id}/course`, { course }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).catch((err) => {
      console.log(err);
    });
  };
}

export function removeCourseFromTerm(course, term) {
  return (dispatch) => {
    return axios.delete(`${ROOT_URL}/terms/${term.id}/course/${course.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

// dialog methods
export function showDialog(type, options) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SHOW_DIALOG, payload: { type, options } });
  };
}

export function hideDialog() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.HIDE_DIALOG });
  };
}
