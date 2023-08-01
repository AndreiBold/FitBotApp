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
} from "../actions/types";

const INITIAL_STATE = {
  userfoodList: [],
  fitnessDetails: {},
  loading: false,
  isAdded: false,
  isEdited: false,
  message: "",
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_USER_FOODS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_FOODS_FAIL:
    case ADD_USER_FOOD_FAIL:
    case SAVE_USER_FOOD_FAIL:
    case DELETE_USER_FOOD_FAIL:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ADD_USER_FOOD_SUCCESS:
      return {
        ...state,
        isAdded: true,
        userfoodList: [...state.userfoodList, action.payload.userfoodItem],
        message: action.payload.message,
      };
    case DELETE_USER_FOOD_SUCCESS:
      return {
        ...state,
        userfoodList: state.userfoodList.filter(
          (userfood) =>
            userfood.userfoodData.foodId !== action.payload.foodId &&
            userfood.userfoodData.dateTime !== action.payload.dateTime
        ),
        message: action.payload.message,
      };
    case SAVE_USER_FOOD_SUCCESS:
      return {
        ...state,
        userfoodList: state.userfoodList.map((elem) => {
          if (
            elem.userfoodData.foodId === action.payload.foodId &&
            elem.userfoodData.dateTime === action.payload.dateTime
          )
            elem = action.payload.userfoodItem;
          return elem;
        }),
        isEdited: true,
        message: action.payload.message,
      };
    case GET_USER_FOODS_SUCCESS:
      return {
        ...state,
        userfoodList: action.payload.userfoodList,
        fitnessDetails: action.payload.fitnessDetails,
        loading: false,
        isAdded: false,
        isEdited: false,
      };
    case AFTER_ADD_USER_FOOD_SUCCESS:
      return {
        ...state,
        isAdded: false,
      };
    case AFTER_SAVE_USER_FOOD_SUCCESS:
      return {
        ...state,
        isEdited: false,
      };
    default:
      return state;
  }
}
