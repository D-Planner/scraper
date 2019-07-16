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
  FETCH_MAJORS: 'FETCH_MAJORS',
  UPDATE_USERCOURSE: 'UPDATE_USERCOURSE',
  FETCH_PROFESSOR: 'FETCH_PROFESSOR',
  FETCH_PREV_COURSES: 'FETCH_PREV_COURSES',
  COURSE_SEARCH: 'COURSE_SEARCH',
  SHOW_DIALOG: 'SHOW_DIALOG',
  HIDE_DIALOG: 'HIDE_DIALOG',
  ERROR_SET: 'ERROR_SET',
  ERROR_CLEAR: 'ERROR_CLEAR',
};

const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090' : 'https://dplanner-api.herokuapp.com';

// ----- Error Handling ----- //
/**
 * An action creator to dispatch and authorization error to redux
 * @export
 * @param {String} error the error message to display
 * @returns an object with the type and message to dispatch to redux
 */
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

/**
 * An action creator to remove an error from redux
 * @export
 * @returns an object with the type and message to dispatch to redux
 */
export function clearError() {
  return {
    type: ActionTypes.ERROR_CLEAR,
    payload: null,
  };
}

// ----- Authorization Actions ----- //

/**
 * Sends a sign-in request to the API and authorizes them with the redux store
 * @export
 * @param {*} { email, password } an object containing email and password
 * @param {*} history the React-Router history object passed to props when using withRouter()
 * @returns a callback function that sends a signin request to the API and then dispatches an AUTH_USER action on success
 */
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

/**
 * Sends a sign-up request to the API and authorizes them with the redux store
 * @export
 * @param {*} { email, password, username } an object containing email and password
 * @param {*} history the React-Router history object passed to props when using withRouter()
 * @returns a callback function that sends a signup request to the API and then dispatches an AUTH_USER action on success
 */
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

/**
 * Sends a sign-out request to the API and deauthenticates them with the redux store
 * @export
 * @param {*} history the React-Router history object passed to props when using withRouter()
 * @returns a callback function that sends a signout request to the API and then dispatches an DEAUTH_USER action on success
 */
export function signoutUser(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
  };
}

/**
 * Fetches the current user from the database and stores their information in the redux store
 * @export
 * @returns an action creator to fetch the current user and stash their info in the store
 */
export function fetchUser() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return dispatch => new Promise(((resolve, reject) => {
    axios.get(`${ROOT_URL}/auth`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_USER, payload: response.data });
      resolve();
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
      reject();
    });
  }));
}

// ----- PLAN ACTIONS ----- //

/**
 * Creates a new plan in the database
 * @export
 * @param {*} plan a JSON plan object to add to the database
 * @param {*} history the React-Router history object passed to props when using withRouter()
 * @returns an action creator to create a new plan in the API
 */
export function createPlan(plan, history) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.post(`${ROOT_URL}/plans`, { plan }, { headers }).then((response) => {
      history.push(`/plan/${response.data.id}`);
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

/**
 * Fetches a list of all plans for a given user
 * @export
 * @returns an action creator to gather all plans and store them in the redux store
 */
export function fetchPlans() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return dispatch => new Promise(((resolve, reject) => {
    axios.get(`${ROOT_URL}/plans`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PLANS, payload: response.data });
      resolve();
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
      reject();
    });
  }));
}

/**
 * Fetches a specific plan by id from the API
 * @export
 * @param {String} planID a string representing a Mongoose ObjectID for the plan to fetch
 * @returns an action creator to fetch a plan and store it in redux
 */
export function fetchPlan(planID) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return dispatch => new Promise(((resolve, reject) => {
    axios.get(`${ROOT_URL}/plans/${planID}`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PLAN, payload: response.data });
      resolve();
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
      reject();
    });
  }));
}

/**
 * Deletes a specific plan from the database
 * @export
 * @param {String} planID a string representing a Mongoose ObjectID for the plan to delete
 * @param {*} history the React-Router history object passed to props when using withRouter()
 * @returns
 */
export function deletePlan(planID, history) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/plans/${planID}`, { headers }).then((response) => {
      dispatch({ type: ActionTypes.DELETE_PLAN, payload: planID });
      history.push('/');
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

// ----- Course Actions ----- //

/**
 * Fetches a list of all courses currently in the database (corresponding to the most recent ORC crawl)
 * @export
 * @returns an action creator to gather all courses and store them in the redux store
 */
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

/**
 * @private
 * Fetches a specific courses from the database (corresponding to the most recent ORC crawl)
 * NOTE: not set up in reducer yet because it's not used
 * @returns an action creator to gather a course and store it in the redux store
 */
export function fetchCourse(id) {
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

/**
 * Fetches a list of all courses that a user has marked as a favorite (i.e. that are in their bookmarks)
 * @export
 * @returns an action creator to gather all bookmarked courses and store them in the redux store
 */
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

/**
 * Fetches a list of Professors for a given course
 * @export
 * @returns an action creator to gather all bookmarked courses and store them in the redux store
 */
export function fetchProfessors(id) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  axios.get(`${ROOT_URL}/professors/${id}`, { headers }).then((r) => {
    console.log(r);
  }).catch((e) => {
    console.log(e);
  });
}

/**
 * Adds a course to a user's favorites (i.e. their bookmarks)
 * @export
 * @param {String} courseID a string representing a Mongoose ObjectID for the course object to store in a user's bookmarks
 * @returns an action creator to add a course to a user's favorites
 */
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
 * Adds a course to a user's placement courses
 * @export
 * @param {String} courseID a string representing a Mongoose ObjectID for the course object to store in a user's bookmarks
 * @returns an action creator to add a course to a user's favorites
 */
export function addCourseToPlacements(courseID) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/courses/placement/${courseID}`, {}, {
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
          dispatch({ type: ActionTypes.COURSE_SEARCH, payload: response.data.filter(c => c.number > 0) });
        }).catch((error) => {
          console.log(error);
          dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
        });
        break;
      case 'distrib':
        axios.get(`${ROOT_URL}/courses/distribs/${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((response) => {
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

/**
 * Adds a new UserCourse object to a specific term
 * @export
 * @param {*} course the course to add to the term (will be converted to a UserCourse object)
 * @param {*} term the term object to which this course should be added
 * @returns an action creator to add a new course to the given term
 */
export function addCourseToTerm(course, term) {
  return (dispatch) => {
    return axios.post(`${ROOT_URL}/terms/${term.id}/course`, { course }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).catch((err) => {
      console.log(err);
      dispatch({ type: ActionTypes.ERROR_SET, payload: err.response.data });
    });
  };
}

/**
 * Removes a UserCourse object from a specific term
 * @export
 * @param {*} course the UserCourse to remove from the term
 * @param {*} term the term object from which this course should be removed
 * @returns an action creator to remove a course from the given term
 */
export function removeCourseFromTerm(course, term) {
  const termID = (typeof term === 'object') ? term.id : term;
  return (dispatch) => {
    return axios.delete(`${ROOT_URL}/terms/${termID}/course/${course.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

export function updateTerm(term) {
  return (dispatch) => {
    return axios.put(`${ROOT_URL}/terms/${term.id}`, term, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      // console.log(response);
      // dispatch({ type: ActionTypes.FETCH_COURSES, payload: response.data });
      // fetchCourse
    })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
      });
  };
}

export function updateUserCourse(userCourseID, changes) {
  return (dispatch) => {
    return axios.post(`${ROOT_URL}/terms/update/course/${userCourseID}`, changes, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      dispatch({ type: ActionTypes.UPDATE_USERCOURSE });
    }).catch((error) => {
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}


export function getPreviousCourses(source) {
  return (dispatch) => {
    return axios.get(`${ROOT_URL}/plans/${source.plan}/prevCourses/${source.term}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PREV_COURSES, payload: response.data });
    }).catch((error) => {
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}

// ----- Major Actions ----- //

/**
 * Fetches all existing majors from the database
 * @export
 * @returns an action creator to fetch all extant majors and store them in redux
 */
export function fetchMajors() {
  return (dispatch) => {
    return axios.get(`${ROOT_URL}/majors/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_MAJORS, payload: response.data });
    }).catch((error) => {
      console.log(error);
      dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
    });
  };
}


/**
 * Delcares a major for a user's profile by adding it to that user object's major field
 * @export
 * @param {String} majorID a string representing the Mongoose ObjectID for a major to declare
 * @returns an action creator to declare a major for a user
 */
export function declareMajor(majorID) {
  return (dispatch) => {
    return axios.post(`${ROOT_URL}/majors/declared/${majorID}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      // console.log(response);
      // dispatch({ type: ActionTypes.FETCH_COURSES, payload: response.data });
      // fetchCourse
    })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.ERROR_SET, payload: error.response.data });
      });
  };
}

// ----- Dialog Actions ----- //

/**
 * Notifies the top-level of the app to display a dialog box
 * @export
 * @param {ActionTypes} type the type of dialog to show
 * @param {*} options the options to send to the dialog (things like title, onOk action, etc)
 * @returns an action creator to display a dialog
 */
export function showDialog(type, options) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SHOW_DIALOG, payload: { type, options } });
  };
}

/**
 * Notifies the top-level of the app to hide the displayed dialog box
 * @export
 * @returns an action creator to hide the global dialog box
 */
export function hideDialog() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.HIDE_DIALOG });
  };
}
