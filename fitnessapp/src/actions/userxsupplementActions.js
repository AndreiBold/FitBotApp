import { returnErrors } from "./errorActions";
import { tokenConfig } from "./userActions";
import axios from "axios";
import {
  ADD_USER_SUPPLEMENT_SUCCESS,
  ADD_USER_SUPPLEMENT_FAIL,
  AFTER_ADD_USER_SUPPLEMENT_SUCCESS,
  SAVE_USER_SUPPLEMENT_SUCCESS,
  SAVE_USER_SUPPLEMENT_FAIL,
  AFTER_SAVE_USER_SUPPLEMENT_SUCCESS,
  DELETE_USER_SUPPLEMENT_SUCCESS,
  DELETE_USER_SUPPLEMENT_FAIL,
  GET_USER_SUPPLEMENTS_LOADING,
  GET_USER_SUPPLEMENTS_SUCCESS,
  GET_USER_SUPPLEMENTS_FAIL,
} from "./types";

export const getUserSupplements = (date) => (dispatch, getState) => {
  dispatch({ type: GET_USER_SUPPLEMENTS_LOADING });

  axios
    .get(`/usersXSupplements/supplements?date=${date}`, tokenConfig(getState))
    .then((res) => {
      console.log(res);
      dispatch({
        type: GET_USER_SUPPLEMENTS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_USER_SUPPLEMENTS_FAIL"
        )
      );
      dispatch({
        type: GET_USER_SUPPLEMENTS_FAIL,
      });
    });
};

export const addUserSupplement = ({ sid, noUnits, details, dateTime }) => (
  dispatch,
  getState
) => {
  const body = JSON.stringify({
    noUnits,
    details,
    dateTime,
  });
  console.log(body);

  axios
    .post(`/usersXSupplements/supplement/${sid}`, body, tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: ADD_USER_SUPPLEMENT_SUCCESS,
        payload: res.data,
      });
    })
    .then((res) => {
      dispatch({ type: AFTER_ADD_USER_SUPPLEMENT_SUCCESS });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADD_USER_SUPPLEMENT_FAIL"
        )
      );
      dispatch({
        type: ADD_USER_SUPPLEMENT_FAIL,
      });
    });
};

export const deleteUserSupplement = (supplementId, dateTime) => (
  dispatch,
  getState
) => {
  axios
    .delete(
      `/usersXSupplements/supplement/${supplementId}/${dateTime}`,
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: DELETE_USER_SUPPLEMENT_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DELETE_USER_SUPPLEMENT_FAIL"
        )
      );
      dispatch({
        type: DELETE_USER_SUPPLEMENT_FAIL,
      });
    });
};

export const saveUserSupplement = (
  supplementId,
  dateTime,
  { noUnits, details }
) => (dispatch, getState) => {
  const body = JSON.stringify({
    noUnits,
    details,
  });

  axios
    .put(
      `/usersXSupplements/supplement/${supplementId}/${dateTime}`,
      body,
      tokenConfig(getState)
    )
    .then((res) => {
      console.log("Action ", res.data);
      dispatch({
        type: SAVE_USER_SUPPLEMENT_SUCCESS,
        payload: res.data,
      });
    })
    .then((res) => {
      dispatch({ type: AFTER_SAVE_USER_SUPPLEMENT_SUCCESS });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "SAVE_USER_SUPPLEMENT_FAIL"
        )
      );
      dispatch({
        type: SAVE_USER_SUPPLEMENT_FAIL,
      });
    });
};

export const addUserSupplementByBot = ({
  name,
  noUnits,
  details,
  dateTime,
}) => async (dispatch, getState) => {
  const body = JSON.stringify({
    name,
    noUnits,
    details,
    dateTime,
  });

  try {
    const res = await axios.post(
      `/usersXSupplements/supplement/?name=${name}`,
      body,
      tokenConfig(getState)
    );

    dispatch({
      type: ADD_USER_SUPPLEMENT_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "ADD_USER_SUPPLEMENT_FAIL"
      )
    );
    dispatch({
      type: ADD_USER_SUPPLEMENT_FAIL,
    });
  }
};

export const deleteUserSupplementByBot = (name) => async (
  dispatch,
  getState
) => {
  try {
    const res = await axios.delete(
      `/usersXSupplements/supplement/?name=${name}`,
      tokenConfig(getState)
    );

    dispatch({
      type: DELETE_USER_SUPPLEMENT_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "DELETE_USER_SUPPLEMENT_FAIL"
      )
    );
    dispatch({
      type: DELETE_USER_SUPPLEMENT_FAIL,
    });
  }
};
