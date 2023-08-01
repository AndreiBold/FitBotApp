import {
  SAVE_CONTEXT_LOADING,
  SAVE_CONTEXT_SUCCESS,
  SAVE_CONTEXT_FAIL,
} from "../actions/types";
import axios from "axios";
import { returnErrors } from "./errorActions";
import { tokenConfig } from "./userActions";

export const saveContext = ({ dateTime, content }) => async (
  dispatch,
  getState
) => {
  dispatch({ type: SAVE_CONTEXT_LOADING });
  const body = JSON.stringify({
    dateTime,
    content,
  });

  try {
    const res = await axios.put("/contexts", body, tokenConfig(getState));

    dispatch({
      type: SAVE_CONTEXT_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(err.response.data, err.response.status, "SAVE_CONTEXT_FAIL")
    );
    dispatch({
      type: SAVE_CONTEXT_FAIL,
    });
  }
};
