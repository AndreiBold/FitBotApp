import {
  ADD_USER_EXERCISE_SUCCESS,
  ADD_USER_EXERCISE_FAIL,
  AFTER_ADD_USER_EXERCISE_SUCCESS,
  SAVE_USER_EXERCISE_SUCCESS,
  SAVE_USER_EXERCISE_FAIL,
  AFTER_SAVE_USER_EXERCISE_SUCCESS,
  DELETE_USER_EXERCISE_SUCCESS,
  DELETE_USER_EXERCISE_FAIL,
  GET_USER_EXERCISES_LOADING,
  GET_USER_EXERCISES_SUCCESS,
  GET_USER_EXERCISES_FAIL,
} from "../actions/types";

const INITIAL_STATE = {
  userexerciseList: [],
  userWeight: 0,
  loading: false,
  isAdded: false,
  isEdited: false,
  message: "",
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_USER_EXERCISES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_EXERCISES_FAIL:
    case ADD_USER_EXERCISE_FAIL:
    case SAVE_USER_EXERCISE_FAIL:
    case DELETE_USER_EXERCISE_FAIL:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ADD_USER_EXERCISE_SUCCESS:
      return {
        ...state,
        isAdded: true,
        userexerciseList: [
          ...state.userexerciseList,
          action.payload.userexerciseItem,
        ],
        message: action.payload.message,
      };
    case DELETE_USER_EXERCISE_SUCCESS:
      return {
        ...state,
        userexerciseList: state.userexerciseList.filter(
          (userexercise) =>
            userexercise.userexerciseData.exerciseId !==
              action.payload.exerciseId &&
            userexercise.userexerciseData.dateTime !== action.payload.dateTime
        ),
        message: action.payload.message,
      };
    case SAVE_USER_EXERCISE_SUCCESS:
      return {
        ...state,
        userexerciseList: state.userexerciseList.map((userexercise) => {
          if (
            userexercise.userexerciseData.exerciseId ===
              action.payload.exerciseId &&
            userexercise.userexerciseData.dateTime === action.payload.dateTime
          )
            userexercise = action.payload.userexerciseItem;
          return userexercise;
        }),
        isEdited: true,
        message: action.payload.message,
      };
    case GET_USER_EXERCISES_SUCCESS:
      return {
        ...state,
        userexerciseList: action.payload.userexerciseList,
        userWeight: action.payload.extractedUserWeight,
        loading: false,
        isAdded: false,
        isEdited: false,
      };
    case AFTER_ADD_USER_EXERCISE_SUCCESS:
      return {
        ...state,
        isAdded: false,
      };
    case AFTER_SAVE_USER_EXERCISE_SUCCESS:
      return {
        ...state,
        isEdited: false,
      };
    default:
      return state;
  }
}
