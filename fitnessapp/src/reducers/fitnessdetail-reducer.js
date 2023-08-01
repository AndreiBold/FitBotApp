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
} from "../actions/types";

import { simpleFormatDate } from "../utils/utils";

const INITIAL_STATE = {
  fitnessDetails: {},
  fitnessDetailsList: [],
  loading: false,
  message: "",
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_LATEST_FITNESS_DETAILS_LOADING:
    case GET_ALL_FITNESS_DETAILS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_LATEST_FITNESS_DETAILS_FAIL:
    case GET_ALL_FITNESS_DETAILS_FAIL:
    case ADD_FITNESS_DETAILS_FAIL:
    case UPDATE_FITNESS_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case GET_LATEST_FITNESS_DETAILS_SUCCESS:
      console.log("REDUCERE", action.payload);
      return {
        ...state,
        loading: false,
        fitnessDetails: action.payload,
      };
    case GET_ALL_FITNESS_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        fitnessDetailsList: action.payload,
      };
    case ADD_FITNESS_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        fitnessDetailsList: [
          ...state.fitnessDetailsList,
          action.payload.record,
        ],
        message: action.payload.message,
      };
    case UPDATE_FITNESS_DETAILS_SUCCESS:
      if (action.payload.intention === "other adds")
        return {
          ...state,
          loading: false,
          fitnessDetailsList: [
            ...state.fitnessDetailsList,
            action.payload.record,
          ],
          message: action.payload.message,
        };
      else {
        return {
          ...state,
          loading: false,
          fitnessDetailsList: state.fitnessDetailsList.map((elem) => {
            if (elem.date === simpleFormatDate(new Date()))
              elem = action.payload.record;
            return elem;
          }),
          message: action.payload.message,
        };
      }
    default:
      return state;
  }
}
