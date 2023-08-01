import { returnErrors } from "./errorActions";
import axios from "axios";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FORGOT_PASS_SUCCESS,
  FORGOT_PASS_FAIL,
  RESET_PASS_SUCCESS,
  RESET_PASS_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  AFTER_UPDATE_USER_SUCCESS,
  CHANGE_PASS_SUCCESS,
  CHANGE_PASS_FAIL,
  DISABLE_USER_SUCCESS,
  DISABLE_USER_FAIL,
} from "./types";

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/users/userdata", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

//Update user
export const updateUser = ({ firstName, lastName, email }) => (
  dispatch,
  getState
) => {
  const body = JSON.stringify({
    firstName,
    lastName,
    email,
  });

  axios
    .put("/users/userdata", body, tokenConfig(getState))
    .then((res) => {
      dispatch({ type: UPDATE_USER_SUCCESS, payload: res.data });
    })
    .then((res) => {
      dispatch({ type: AFTER_UPDATE_USER_SUCCESS });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "UPDATE_USER_FAIL")
      );
      dispatch({
        type: UPDATE_USER_FAIL,
      });
    });
};

//Change password
export const changePassword = ({ email, oldPassword, newPassword }) => (
  dispatch,
  getState
) => {
  const body = JSON.stringify({
    email,
    oldPassword,
    newPassword,
  });

  axios
    .post("/users/change_password", body, tokenConfig(getState))
    .then((res) => {
      dispatch({ type: CHANGE_PASS_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "CHANGE_PASS_FAIL")
      );
      dispatch({
        type: CHANGE_PASS_FAIL,
      });
    });
};

//Disable user's account
export const disableUser = () => (dispatch, getState) => {
  axios
    .delete("/users/userdata", tokenConfig(getState))
    .then((res) => {
      dispatch({ type: DISABLE_USER_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DISABLE_USER_FAIL"
        )
      );
      dispatch({
        type: DISABLE_USER_FAIL,
      });
    });
};

//Register User
export const register = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  securityAnswer,
  birthDate,
  gender,
}) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Request body
  const body = JSON.stringify({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    securityAnswer,
    birthDate,
    gender,
  });

  axios
    .post("/users/", body, config)
    .then((res) =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// Login user
export const login = ({ email, password }) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Request body
  const body = JSON.stringify({ email, password });

  axios
    .post("/users/login", body, config)
    .then((res) =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};
// Logout user
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

// Forgot password
export const forgotPassword = ({ email, securityAnswer }) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Request body
  const body = JSON.stringify({ email, securityAnswer });

  axios
    .post("/users/forgot_password", body, config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: FORGOT_PASS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(err.response.data, err.response.status, "FORGOT_PASS_FAIL")
      );
      dispatch({
        type: FORGOT_PASS_FAIL,
      });
    });
};

// Reset password
export const resetPassword = ({ newPassword, confirmPassword, token }) => (
  dispatch
) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Request body
  const body = JSON.stringify({ newPassword, confirmPassword });

  axios
    .post(`/users/reset/${token}`, body, config)
    .then((res) =>
      dispatch({
        type: RESET_PASS_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "RESET_PASS_FAIL")
      );
      dispatch({
        type: RESET_PASS_FAIL,
      });
    });
};

//Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token fron localstorage
  const token = getState().user.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
