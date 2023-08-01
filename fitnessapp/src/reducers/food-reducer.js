import {
  GET_FOODS_BY_TYPE_LOADING,
  GET_FOODS_BY_TYPE_SUCCESS,
  GET_FOODS_BY_TYPE_FAIL,
  GET_FOOD_DETAILS_LOADING,
  GET_FOOD_DETAILS_SUCCESS,
  GET_FOOD_DETAILS_FAIL,
  CLEAR,
} from "../actions/types";

const INITIAL_STATE = {
  foodsByTypeList: [],
  foodDetails: null,
  loading: false,
  fetched: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_FOODS_BY_TYPE_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
      };
    case GET_FOODS_BY_TYPE_SUCCESS:
      return {
        ...state,
        foodsByTypeList: action.payload,
        loading: false,
        fetched: true,
      };
    case GET_FOODS_BY_TYPE_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
      };
    case GET_FOOD_DETAILS_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
      };
    case GET_FOOD_DETAILS_SUCCESS:
      return {
        ...state,
        foodDetails: action.payload,
        loading: false,
        fetched: true,
      };
    case GET_FOOD_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
      };
    case CLEAR:
      return {
        ...state,
        foodsByTypeList: action.payload,
        foodDetails: null,
      };
    default:
      return state;
  }
}
