import { returnErrors } from "./errorActions";
import { tokenConfig } from "./userActions";
import axios from "axios";
import {
  ADD_USER_EXERCISE_SUCCESS,
  ADD_USER_EXERCISE_FAIL,
  AFTER_ADD_USER_EXERCISE_SUCCESS,
  SAVE_USER_EXERCISE_SUCCESS,
  SAVE_USER_EXERCISE_FAIL,
  AFTER_SAVE_USER_EXERCISE_SUCCESS,
  DELETE_USER_EXERCISE_SUCCESS,
  DELETE_USER_EXERCISE_FAIL,
  GET_USER_EXERCISES_LOADING,
  GET_USER_EXERCISES_SUCCESS,
  GET_USER_EXERCISES_FAIL,
} from "./types";

export const getUserExercises = (date) => (dispatch, getState) => {
  dispatch({ type: GET_USER_EXERCISES_LOADING });

  axios
    .get(`/usersXExercises/exercises?date=${date}`, tokenConfig(getState))
    .then((res) => {
      console.log(res);
      dispatch({
        type: GET_USER_EXERCISES_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_USER_EXERCISES_FAIL"
        )
      );
      dispatch({
        type: GET_USER_EXERCISES_FAIL,
      });
    });
};

export const addUserExercise = ({
  eid,
  workoutNumber,
  minutesDuration,
  details,
  dateTime,
}) => (dispatch, getState) => {
  const body = JSON.stringify({
    workoutNumber,
    minutesDuration,
    details,
    dateTime,
  });
  console.log(body);

  axios
    .post(`/usersXExercises/exercise/${eid}`, body, tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: ADD_USER_EXERCISE_SUCCESS,
        payload: res.data,
      });
    })
    .then((res) => {
      dispatch({ type: AFTER_ADD_USER_EXERCISE_SUCCESS });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADD_USER_EXERCISE_FAIL"
        )
      );
      dispatch({
        type: ADD_USER_EXERCISE_FAIL,
      });
    });
};

export const deleteUserExercise = (exerciseId, dateTime) => (
  dispatch,
  getState
) => {
  axios
    .delete(
      `/usersXExercises/exercise/${exerciseId}/${dateTime}`,
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: DELETE_USER_EXERCISE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DELETE_USER_EXERCISE_FAIL"
        )
      );
      dispatch({
        type: DELETE_USER_EXERCISE_FAIL,
      });
    });
};

export const saveUserExercise = (
  exerciseId,
  dateTime,
  { workoutNumber, minutesDuration, details }
) => (dispatch, getState) => {
  const body = JSON.stringify({
    workoutNumber,
    minutesDuration,
    details,
  });

  axios
    .put(
      `/usersXExercises/exercise/${exerciseId}/${dateTime}`,
      body,
      tokenConfig(getState)
    )
    .then((res) => {
      console.log("Action ", res.data);
      dispatch({
        type: SAVE_USER_EXERCISE_SUCCESS,
        payload: res.data,
      });
    })
    .then((res) => {
      dispatch({ type: AFTER_SAVE_USER_EXERCISE_SUCCESS });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "SAVE_USER_EXERCISE_FAIL"
        )
      );
      dispatch({
        type: SAVE_USER_EXERCISE_FAIL,
      });
    });
};

export const addUserExerciseByBot = ({
  name,
  workoutNumber,
  minutesDuration,
  details,
  dateTime,
}) => async (dispatch, getState) => {
  const body = JSON.stringify({
    name,
    workoutNumber,
    minutesDuration,
    details,
    dateTime,
  });

  try {
    const res = await axios.post(
      `/usersXExercises/exercise/?name=${name}`,
      body,
      tokenConfig(getState)
    );

    dispatch({
      type: ADD_USER_EXERCISE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "ADD_USER_EXERCISE_FAIL"
      )
    );
    dispatch({
      type: ADD_USER_EXERCISE_FAIL,
    });
  }
};

export const deleteUserExerciseByBot = ({ name, workoutNumber }) => async (
  dispatch,
  getState
) => {
  try {
    const res = await axios.delete(
      `/usersXExercises/exercise/?name=${name}&workoutNumber=${workoutNumber}`,
      tokenConfig(getState)
    );

    dispatch({
      type: DELETE_USER_EXERCISE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "DELETE_USER_EXERCISE_FAIL"
      )
    );
    dispatch({
      type: DELETE_USER_EXERCISE_FAIL,
    });
  }
};
