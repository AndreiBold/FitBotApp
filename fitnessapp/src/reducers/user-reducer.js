import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  FORGOT_PASS_SUCCESS,
  FORGOT_PASS_FAIL,
  RESET_PASS_SUCCESS,
  RESET_PASS_FAIL,
  CHANGE_PASS_SUCCESS,
  CHANGE_PASS_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  AFTER_UPDATE_USER_SUCCESS,
  DISABLE_USER_SUCCESS,
  DISABLE_USER_FAIL,
} from "../actions/types";

const INITIAL_STATE = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  isEmailSent: false,
  isEdited: false,
  isDisabled: false,
  userData: {},
  message: "",
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        isEdited: false,
        userData: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        userData: {},
        isAuthenticated: false,
        isLoading: false,
        message: "",
      };
    case FORGOT_PASS_SUCCESS:
    case RESET_PASS_SUCCESS:
    case CHANGE_PASS_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isEmailSent: true,
        message: action.payload.message,
      };
    case FORGOT_PASS_FAIL:
    case RESET_PASS_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isEmailSent: false,
        message: action.payload.message,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        isEdited: true,
        userData: action.payload.user,
        message: action.payload.message,
      };
    case UPDATE_USER_FAIL:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        isEdited: false,
        message: action.payload,
      };
    case AFTER_UPDATE_USER_SUCCESS:
      return {
        ...state,
        isEdited: false,
      };
    case CHANGE_PASS_FAIL:
    case DISABLE_USER_FAIL:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        isEmailSent: false,
        isDisabled: false,
        message: action.payload,
      };
    case DISABLE_USER_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isEmailSent: false,
        isEdited: false,
        message: action.payload.message,
        isDisabled: true,
      };
    default:
      return state;
  }
}
