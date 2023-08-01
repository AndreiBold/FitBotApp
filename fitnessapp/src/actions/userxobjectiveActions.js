import { returnErrors } from "./errorActions";
import { tokenConfig } from "./userActions";
import axios from "axios";
import {
  GET_CURRENT_OBJECTIVE_LOADING,
  GET_CURRENT_OBJECTIVE_SUCCESS,
  GET_CURRENT_OBJECTIVE_FAIL,
  GET_OBJECTIVES_HISTORY_LOADING,
  GET_OBJECTIVES_HISTORY_SUCCESS,
  GET_OBJECTIVES_HISTORY_FAIL,
  ADD_OBJECTIVE_SUCCESS,
  ADD_OBJECTIVE_FAIL,
  UPDATE_CURRENT_OBJECTIVE_SUCCESS,
  UPDATE_CURRENT_OBJECTIVE_FAIL,
} from "./types";

export const getCurrentObjective = () => (dispatch, getState) => {
  dispatch({ type: GET_CURRENT_OBJECTIVE_LOADING });

  axios
    .get("/usersXObjectives/current", tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_CURRENT_OBJECTIVE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_CURRENT_OBJECTIVE_FAIL"
        )
      );
      dispatch({
        type: GET_CURRENT_OBJECTIVE_FAIL,
      });
    });
};

export const getObjectivesHistory = () => (dispatch, getState) => {
  dispatch({ type: GET_OBJECTIVES_HISTORY_LOADING });

  axios
    .get("/usersXObjectives/objectives", tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_OBJECTIVES_HISTORY_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_OBJECTIVES_HISTORY_FAIL"
        )
      );
      dispatch({
        type: GET_OBJECTIVES_HISTORY_FAIL,
      });
    });
};

export const addUserObjective = ({
  name,
  dateStart,
  dateStop,
  objectiveWeight,
}) => async (dispatch, getState) => {
  const body = JSON.stringify({
    name,
    dateStart,
    dateStop,
    objectiveWeight,
  });

  try {
    const res = await axios.post(
      `/usersXObjectives/objective/?name=${name}`,
      body,
      tokenConfig(getState)
    );

    dispatch({
      type: ADD_OBJECTIVE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(err.response.data, err.response.status, "ADD_OBJECTIVE_FAIL")
    );
    dispatch({
      type: ADD_OBJECTIVE_FAIL,
    });
  }
};

export const updateCurrentObjective = () => async (dispatch, getState) => {
  try {
    const res = axios.put("/usersXObjectives/current", tokenConfig(getState));

    dispatch({
      type: UPDATE_CURRENT_OBJECTIVE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data,
        err.response.status,
        "UPDATE_CURRENT_OBJECTIVE_FAIL"
      )
    );
    dispatch({
      type: UPDATE_CURRENT_OBJECTIVE_FAIL,
    });
  }
};

// export const updateCurrentObjective = () => async (dispatch, getState) => {
//   axios
//     .put("/usersXObjectives/current", tokenConfig(getState))
//     .then((res) => {
//       console.log(res.data);
//       dispatch({
//         type: UPDATE_CURRENT_OBJECTIVE_SUCCESS,
//         payload: res.data,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       dispatch(
//         returnErrors(
//           err.response.data,
//           err.response.status,
//           "UPDATE_CURRENT_OBJECTIVE_FAIL"
//         )
//       );
//       dispatch({
//         type: UPDATE_CURRENT_OBJECTIVE_FAIL,
//       });
//     });
// };
