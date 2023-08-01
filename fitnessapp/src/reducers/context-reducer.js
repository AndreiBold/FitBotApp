import {
  SAVE_CONTEXT_LOADING,
  SAVE_CONTEXT_SUCCESS,
  SAVE_CONTEXT_FAIL,
} from "../actions/types";

const INITIAL_STATE = {
  currentContext: {},
  loading: false,
  fetched: false,
  err: "",
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAVE_CONTEXT_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
        err: "",
      };
    case SAVE_CONTEXT_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
        err: action.payload.message,
      };
    case SAVE_CONTEXT_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        currentContext: action.payload.currentContext,
        err: "",
      };
    default:
      return state;
  }
}
