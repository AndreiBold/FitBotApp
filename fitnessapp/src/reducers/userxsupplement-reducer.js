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
} from "../actions/types";

const INITIAL_STATE = {
  usersupplementList: [],
  fitnessDetails: {},
  loading: false,
  isAdded: false,
  isEdited: false,
  message: "",
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_USER_SUPPLEMENTS_LOADING:
      // console.log("TEST LOADING");
      return {
        ...state,
        loading: true,
      };
    case GET_USER_SUPPLEMENTS_FAIL:
    case ADD_USER_SUPPLEMENT_FAIL:
    case SAVE_USER_SUPPLEMENT_FAIL:
    case DELETE_USER_SUPPLEMENT_FAIL:
      console.log("TEST FAIL");
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ADD_USER_SUPPLEMENT_SUCCESS:
      return {
        ...state,
        isAdded: true,
        usersupplementList: [
          ...state.usersupplementList,
          action.payload.usersupplementItem,
        ],
        message: action.payload.message,
      };
    case DELETE_USER_SUPPLEMENT_SUCCESS:
      // console.log("TEST DELETE SUCCESS");
      // console.log(action.payload);
      return {
        ...state,
        usersupplementList: state.usersupplementList.filter(
          (usersupplement) =>
            usersupplement.usersupplementData.supplementId !==
              action.payload.supplementId &&
            usersupplement.usersupplementData.dateTime !==
              action.payload.dateTime
        ),
        message: action.payload.message,
      };
    case SAVE_USER_SUPPLEMENT_SUCCESS:
      console.log("TEST SAVE SUCCESS");
      return {
        ...state,
        usersupplementList: state.usersupplementList.map((elem) => {
          if (
            elem.usersupplementData.supplementId ===
              action.payload.supplementId &&
            elem.usersupplementData.dateTime === action.payload.dateTime
          )
            elem = action.payload.usersupplementItem;
          return elem;
        }),
        isEdited: true,
        message: action.payload.message,
      };
    case GET_USER_SUPPLEMENTS_SUCCESS:
      // console.log("TEST GET SUCCESS");
      console.log(action.payload);
      return {
        ...state,
        usersupplementList: action.payload.usersupplementList,
        fitnessDetails: action.payload.fitnessDetails,
        loading: false,
        isAdded: false,
        isEdited: false,
      };
    case AFTER_ADD_USER_SUPPLEMENT_SUCCESS:
      return {
        ...state,
        isAdded: false,
      };
    case AFTER_SAVE_USER_SUPPLEMENT_SUCCESS:
      return {
        ...state,
        isEdited: false,
      };
    default:
      return state;
  }
}
