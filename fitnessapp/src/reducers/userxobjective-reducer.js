import {
  GET_CURRENT_OBJECTIVE_LOADING,
  GET_CURRENT_OBJECTIVE_SUCCESS,
  GET_CURRENT_OBJECTIVE_FAIL,
  GET_OBJECTIVES_HISTORY_LOADING,
  GET_OBJECTIVES_HISTORY_FAIL,
  GET_OBJECTIVES_HISTORY_SUCCESS,
  ADD_OBJECTIVE_SUCCESS,
  ADD_OBJECTIVE_FAIL,
  UPDATE_CURRENT_OBJECTIVE_SUCCESS,
  UPDATE_CURRENT_OBJECTIVE_FAIL,
} from "../actions/types";

const INITIAL_STATE = {
  currentObjective: {},
  objectiveName: "",
  userStartWeight: "",
  userCurrentWeight: "",
  userObjectiveList: [],
  loading: false,
  message: "",
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_CURRENT_OBJECTIVE_LOADING:
    case GET_OBJECTIVES_HISTORY_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_CURRENT_OBJECTIVE_FAIL:
    case GET_OBJECTIVES_HISTORY_FAIL:
    case ADD_OBJECTIVE_FAIL:
    case UPDATE_CURRENT_OBJECTIVE_FAIL:
      console.log("TREBUIE SA MERGI");
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case GET_CURRENT_OBJECTIVE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentObjective: action.payload.currentObjective,
        objectiveName: action.payload.objectiveName,
        userStartWeight: action.payload.userStartWeight,
        userCurrentWeight: action.payload.userCurrentWeight,
      };
    case GET_OBJECTIVES_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        userObjectiveList: action.payload,
      };
    case ADD_OBJECTIVE_SUCCESS:
      return {
        loading: false,
        userObjectiveList: [
          ...state.userObjectiveList,
          action.payload.userobjectiveItem,
        ],
      };
    case UPDATE_CURRENT_OBJECTIVE_SUCCESS:
      console.log("DC NU MERGI");
      return {
        loading: false,
        userObjectiveList: state.userObjectiveList.map((elem) => {
          if (
            elem.userobjectiveData.objectiveId === action.payload.objectiveId &&
            elem.userobjectiveData.dateStart === action.payload.dateStart
          )
            elem = action.payload.userobjectiveItem;
          return elem;
        }),
      };
    default:
      return state;
  }
}
