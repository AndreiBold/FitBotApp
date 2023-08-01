import { returnErrors } from "./errorActions";
import { tokenConfig } from "./userActions";
import axios from "axios";
import {
  ADD_USER_FOOD_SUCCESS,
  ADD_USER_FOOD_FAIL,
  AFTER_ADD_USER_FOOD_SUCCESS,
  SAVE_USER_FOOD_SUCCESS,
  SAVE_USER_FOOD_FAIL,
  AFTER_SAVE_USER_FOOD_SUCCESS,
  DELETE_USER_FOOD_SUCCESS,
  DELETE_USER_FOOD_FAIL,
  GET_USER_FOODS_LOADING,
  GET_USER_FOODS_SUCCESS,
  GET_USER_FOODS_FAIL,
} from "./types";

export const getUserFoods = (date) => (dispatch, getState) => {
  dispatch({ type: GET_USER_FOODS_LOADING });

  axios
    .get(`/usersXFoods/foods?date=${date}`, tokenConfig(getState))
    .then((res) => {
      console.log(res);
      dispatch({
        type: GET_USER_FOODS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_USER_FOODS_FAIL"
        )
      );
      dispatch({
        type: GET_USER_FOODS_FAIL,
      });
    });
};

export const addUserFood = ({
  fid,
  mealNumber,
  noUnits,
  details,
  dateTime,
}) => (dispatch, getState) => {
  const body = JSON.stringify({
    mealNumber,
    noUnits,
    details,
    dateTime,
  });
  console.log(body);

  axios
    .post(`/usersXFoods/food/${fid}`, body, tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: ADD_USER_FOOD_SUCCESS,
        payload: res.data,
      });
    })
    .then((res) => {
      dispatch({ type: AFTER_ADD_USER_FOOD_SUCCESS });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADD_USER_FOOD_FAIL"
        )
      );
      dispatch({
        type: ADD_USER_FOOD_FAIL,
      });
    });
};

export const deleteUserFood = (foodId, dateTime) => (dispatch, getState) => {
  axios
    .delete(`/usersXFoods/food/${foodId}/${dateTime}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_USER_FOOD_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DELETE_USER_FOOD_FAIL"
        )
      );
      dispatch({
        type: DELETE_USER_FOOD_FAIL,
      });
    });
};

export const saveUserFood = (
  foodId,
  dateTime,
  { mealNumber, noUnits, details }
) => (dispatch, getState) => {
  const body = JSON.stringify({
    mealNumber,
    noUnits,
    details,
  });

  axios
    .put(`/usersXFoods/food/${foodId}/${dateTime}`, body, tokenConfig(getState))
    .then((res) => {
      console.log("Action ", res.data);
      dispatch({
        type: SAVE_USER_FOOD_SUCCESS,
        payload: res.data,
      });
    })
    .then((res) => {
      dispatch({ type: AFTER_SAVE_USER_FOOD_SUCCESS });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "SAVE_USER_FOOD_FAIL"
        )
      );
      dispatch({
        type: SAVE_USER_FOOD_FAIL,
      });
    });
};

export const addUserFoodByBot = ({
  name,
  mealNumber,
  noUnits,
  details,
  dateTime,
}) => async (dispatch, getState) => {
  const body = JSON.stringify({
    name,
    mealNumber,
    noUnits,
    details,
    dateTime,
  });

  try {
    const res = await axios.post(
      `/usersXFoods/food/?name=${name}`,
      body,
      tokenConfig(getState)
    );

    dispatch({
      type: ADD_USER_FOOD_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(err.response.data, err.response.status, "ADD_USER_FOOD_FAIL")
    );
    dispatch({
      type: ADD_USER_FOOD_FAIL,
    });
  }
};

export const deleteUserFoodByBot = ({ name, mealNumber }) => async (
  dispatch,
  getState
) => {
  try {
    const res = await axios.delete(
      `/usersXFoods/food/?name=${name}&mealNumber=${mealNumber}`,
      tokenConfig(getState)
    );

    dispatch({
      type: DELETE_USER_FOOD_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "DELETE_USER_FOOD_FAIL"
      )
    );
    dispatch({
      type: DELETE_USER_FOOD_FAIL,
    });
  }
};
