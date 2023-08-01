import {
  GET_SUPPLEMENTS_BY_TYPE_LOADING,
  GET_SUPPLEMENTS_BY_TYPE_SUCCESS,
  GET_SUPPLEMENTS_BY_TYPE_FAIL,
  GET_SUPPLEMENT_DETAILS_LOADING,
  GET_SUPPLEMENT_DETAILS_SUCCESS,
  GET_SUPPLEMENT_DETAILS_FAIL,
  CLEAR,
} from "../actions/types";

const INITIAL_STATE = {
  supplementsByTypeList: [],
  supplementDetails: null,
  loading: false,
  fetched: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_SUPPLEMENTS_BY_TYPE_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
      };
    case GET_SUPPLEMENTS_BY_TYPE_SUCCESS:
      return {
        ...state,
        supplementsByTypeList: action.payload,
        loading: false,
        fetched: true,
      };
    case GET_SUPPLEMENTS_BY_TYPE_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
      };
    case GET_SUPPLEMENT_DETAILS_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
      };
    case GET_SUPPLEMENT_DETAILS_SUCCESS:
      return {
        ...state,
        supplementDetails: action.payload,
        loading: false,
        fetched: true,
      };
    case GET_SUPPLEMENT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
      };
    case CLEAR:
      return {
        ...state,
        supplementsByTypeList: action.payload,
        supplementDetails: null,
      };
    default:
      return state;
  }
}
