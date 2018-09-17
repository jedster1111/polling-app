import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, UserState } from "./rootReducer";

const userStateReducer: Reducer = (
  userState: UserState = initialState.userState,
  action: AnyAction
): UserState => {
  switch (action.type) {
    case actionTypes.SAVE_USER_FORM_DATA:
      return {
        ...userState,
        name: action.payload.name
      };
    default:
      return userState;
  }
};

export default userStateReducer;
