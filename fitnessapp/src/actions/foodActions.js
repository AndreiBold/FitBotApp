import { returnErrors } from "./errorActions";
import axios from "axios";
import {
  GET_FOODS_BY_TYPE_LOADING,
  GET_FOODS_BY_TYPE_SUCCESS,
  GET_FOODS_BY_TYPE_FAIL,
  GET_FOOD_DETAILS_LOADING,
  GET_FOOD_DETAILS_SUCCESS,
  GET_FOOD_DETAILS_FAIL,
  CLEAR,
} from "./types";

export const getFoods = (foodType) => (dispatch) => {
  dispatch({ type: GET_FOODS_BY_TYPE_LOADING });

  axios
    .get(`/foods/?type=${foodType}`)
    .then((res) => {
      dispatch({
        type: GET_FOODS_BY_TYPE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_FOODS_BY_TYPE_FAIL"
        )
      );
      dispatch({
        type: GET_FOODS_BY_TYPE_FAIL,
      });
    });
};

export const getFoodDetails = (id) => (dispatch) => {
  dispatch({ type: GET_FOOD_DETAILS_LOADING });
  axios
    .get(`/foods/${id}`)
    .then((res) => {
      dispatch({
        type: GET_FOOD_DETAILS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_FOOD_DETAILS_FAIL"
        )
      );
      dispatch({
        type: GET_FOOD_DETAILS_FAIL,
      });
    });
};

export const clear = () => {
  return {
    type: CLEAR,
    payload: [],
  };
};
