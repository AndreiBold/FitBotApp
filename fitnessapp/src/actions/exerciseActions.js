import { returnErrors } from "./errorActions";
import axios from "axios";
import {
  GET_EXERCISES_BY_TYPE_LOADING,
  GET_EXERCISES_BY_TYPE_SUCCESS,
  GET_EXERCISES_BY_TYPE_FAIL,
  GET_EXERCISE_DETAILS_LOADING,
  GET_EXERCISE_DETAILS_SUCCESS,
  GET_EXERCISE_DETAILS_FAIL,
  CLEAR,
} from "./types";

export const getExercises = (exerciseType) => (dispatch) => {
  dispatch({ type: GET_EXERCISES_BY_TYPE_LOADING });

  axios
    .get(`/exercises/?type=${exerciseType}`)
    .then((res) => {
      dispatch({
        type: GET_EXERCISES_BY_TYPE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_EXERCISES_BY_TYPE_FAIL"
        )
      );
      dispatch({
        type: GET_EXERCISES_BY_TYPE_FAIL,
      });
    });
};

export const getExerciseDetails = (id) => (dispatch) => {
  dispatch({ type: GET_EXERCISE_DETAILS_LOADING });
  axios
    .get(`/exercises/${id}`)
    .then((res) => {
      dispatch({
        type: GET_EXERCISE_DETAILS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_EXERCISE_DETAILS_FAIL"
        )
      );
      dispatch({
        type: GET_EXERCISE_DETAILS_FAIL,
      });
    });
};

export const clear = () => {
  return {
    type: CLEAR,
    payload: [],
  };
};
