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
  // localStorage.removeItem('expirationDate')
  return {
    type: actionTypes.AUTH_LOGOUT
  }
};

export const checkAuthExpiration = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000)
  }
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      // returnSecureToken: true
    }
    let url = '/register';
    if (!isSignUp) {
      url = '/login';
    }
    axios.get('/sanctum/csrf-cookie')
    .then(response => {
      axios.post(url, authData)
      .then(response => {
        console.log(response)
        // const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.token);
        // localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.user.id);
        // dispatch(checkAuthExpiration(response.data.expiresIn));
        // dispatch(authSuccess(response.data.idToken, response.data.localId));
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

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate < new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(checkAuthExpiration((expirationDate.getTime() - new Date().getTime()) / 1000));
        dispatch(authSuccess(token, userId));
      }
    }
  }
}