import * as actionTypes from './actionTypes';
import axios from '../../axios-laravel';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
};

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: userId
  }
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  }
};

export const auth = (email, password, username, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      username: username
    }
    let url = '/register';
    if (!isSignUp) {
      url = '/login';
    }
    axios.get('/sanctum/csrf-cookie')
    .then(response => {
      axios.post(url, authData)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
      })
      .catch(err => {
        dispatch(authFail(err.response.data.message));
      })
    })
    .catch(err => {
      console.log(err)
    })    
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    redirectPath: path
  }
}