import {
  GET_EXERCISES_BY_TYPE_LOADING,
  GET_EXERCISES_BY_TYPE_SUCCESS,
  GET_EXERCISES_BY_TYPE_FAIL,
  GET_EXERCISE_DETAILS_LOADING,
  GET_EXERCISE_DETAILS_SUCCESS,
  GET_EXERCISE_DETAILS_FAIL,
  CLEAR,
} from "../actions/types";

const INITIAL_STATE = {
  exercisesByTypeList: [],
  exerciseDetails: null,
  loading: false,
  fetched: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_EXERCISES_BY_TYPE_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
      };
    case GET_EXERCISES_BY_TYPE_SUCCESS:
      return {
        ...state,
        exercisesByTypeList: action.payload,
        loading: false,
        fetched: true,
      };
    case GET_EXERCISES_BY_TYPE_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
      };
    case GET_EXERCISE_DETAILS_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
      };
    case GET_EXERCISE_DETAILS_SUCCESS:
      return {
        ...state,
        exerciseDetails: action.payload,
        loading: false,
        fetched: true,
      };
    case GET_EXERCISE_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
      };
    case CLEAR:
      return {
        ...state,
        exercisesByTypeList: action.payload,
        exerciseDetails: null,
      };
    default:
      return state;
  }
}
