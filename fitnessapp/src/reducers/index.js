import { combineReducers } from "redux";
import userReducer from "./user-reducer";
import errorReducer from "./error-reducer";
import foodReducer from "./food-reducer";
import userxfoodReducer from "./userxfood-reducer";
import exerciseReducer from "./exercise-reducer";
import userxexerciseReducer from "./userxexercise-reducer";
import supplementReducer from "./supplement-reducer";
import userxsupplementReducer from "./userxsupplement-reducer";
import fitnessdetailReducer from "./fitnessdetail-reducer";
import userxobjectiveReducer from "./userxobjective-reducer";
import chatReducer from "./chat-reducer";
import contextReducer from "./context-reducer";

export default combineReducers({
  user: userReducer,
  error: errorReducer,
  food: foodReducer,
  userxfood: userxfoodReducer,
  exercise: exerciseReducer,
  userxexercise: userxexerciseReducer,
  supplement: supplementReducer,
  userxsupplement: userxsupplementReducer,
  fitnessdetail: fitnessdetailReducer,
  userxobjective: userxobjectiveReducer,
  chat: chatReducer,
  context: contextReducer,
});
