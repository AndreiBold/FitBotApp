import { returnErrors } from "./errorActions";
import { tokenConfig } from "./userActions";
import axios from "axios";
import {
  GET_LATEST_FITNESS_DETAILS_LOADING,
  GET_LATEST_FITNESS_DETAILS_SUCCESS,
  GET_LATEST_FITNESS_DETAILS_FAIL,
  GET_ALL_FITNESS_DETAILS_LOADING,
  GET_ALL_FITNESS_DETAILS_SUCCESS,
  GET_ALL_FITNESS_DETAILS_FAIL,
  ADD_FITNESS_DETAILS_SUCCESS,
  ADD_FITNESS_DETAILS_FAIL,
  UPDATE_FITNESS_DETAILS_SUCCESS,
  UPDATE_FITNESS_DETAILS_FAIL,
} from "./types";

export const getLatestFitnessDetails = () => (dispatch, getState) => {
  dispatch({ type: GET_LATEST_FITNESS_DETAILS_LOADING });

  axios
    .get("/fitnessDetails/latest", tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_LATEST_FITNESS_DETAILS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_LATEST_FITNESS_DETAILS_FAIL"
        )
      );
      dispatch({
        type: GET_LATEST_FITNESS_DETAILS_FAIL,
      });
    });
};

export const getAllFitnessDetails = () => (dispatch, getState) => {
  dispatch({ type: GET_ALL_FITNESS_DETAILS_LOADING });

  axios
    .get("/fitnessDetails/", tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_ALL_FITNESS_DETAILS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_ALL_FITNESS_DETAILS_FAIL"
        )
      );
      dispatch({
        type: GET_ALL_FITNESS_DETAILS_FAIL,
      });
    });
};

export const addFitnessDetails = ({
  date,
  weight,
  height,
  mantainanceCalories,
  totalDailyCalories,
  protein,
  fats,
  carbs,
  dietType,
  activityLevel,
}) => async (dispatch, getState) => {
  const body = JSON.stringify({
    date,
    weight,
    height,
    mantainanceCalories,
    totalDailyCalories,
    protein,
    fats,
    carbs,
    dietType,
    activityLevel,
  });

  try {
    const res = await axios.put("/fitnessDetails", body, tokenConfig(getState));
    console.log("ADD FITNESS DETAILS", res.data);

    dispatch({
      type: ADD_FITNESS_DETAILS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "ADD_FITNESS_DETAILS_FAIL"
      )
    );
    dispatch({
      type: ADD_FITNESS_DETAILS_FAIL,
    });
  }
};

export const updateFitnessDetails = ({
  date,
  weight,
  height,
  dietType,
}) => async (dispatch, getState) => {
  const body = JSON.stringify({
    date,
    weight,
    height,
    dietType,
  });

  try {
    const res = await axios.put("/fitnessDetails", body, tokenConfig(getState));
    console.log("UPDATE FITNESS DETAILS", res.data);

    dispatch({
      type: UPDATE_FITNESS_DETAILS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "UPDATE_FITNESS_DETAILS_FAIL"
      )
    );
    dispatch({
      type: UPDATE_FITNESS_DETAILS_FAIL,
    });
  }
};
