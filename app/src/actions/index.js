export const ActionTypes = {
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEATH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
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
