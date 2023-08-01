import { returnErrors } from "./errorActions";
import axios from "axios";
import {
  GET_SUPPLEMENTS_BY_TYPE_LOADING,
  GET_SUPPLEMENTS_BY_TYPE_SUCCESS,
  GET_SUPPLEMENTS_BY_TYPE_FAIL,
  GET_SUPPLEMENT_DETAILS_LOADING,
  GET_SUPPLEMENT_DETAILS_SUCCESS,
  GET_SUPPLEMENT_DETAILS_FAIL,
  CLEAR,
} from "./types";

export const getSupplements = (supplementType) => (dispatch) => {
  dispatch({ type: GET_SUPPLEMENTS_BY_TYPE_LOADING });

  axios
    .get(`/supplements/?type=${supplementType}`)
    .then((res) => {
      dispatch({
        type: GET_SUPPLEMENTS_BY_TYPE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_SUPPLEMENTS_BY_TYPE_FAIL"
        )
      );
      dispatch({
        type: GET_SUPPLEMENTS_BY_TYPE_FAIL,
      });
    });
};

export const getSupplementDetails = (id) => (dispatch) => {
  dispatch({ type: GET_SUPPLEMENT_DETAILS_LOADING });
  axios
    .get(`/supplements/${id}`)
    .then((res) => {
      dispatch({
        type: GET_SUPPLEMENT_DETAILS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_SUPPLEMENT_DETAILS_FAIL"
        )
      );
      dispatch({
        type: GET_SUPPLEMENT_DETAILS_FAIL,
      });
    });
};

export const clear = () => {
  return {
    type: CLEAR,
    payload: [],
  };
};
