import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, UserFormState } from "./rootReducer";

const userFormStateReducer: Reducer = (
  userFormState: UserFormState = initialState.userFormState,
  action: AnyAction
): UserFormState => {
  switch (action.type) {
    case actionTypes.CHANGE_USER_FORM_DATA:
      return {
        ...userFormState,
        data: {
          ...userFormState.data,
          [action.payload.fieldId]: action.payload.value
        }
      };
    default:
      return userFormState;
  }
};

export default userFormStateReducer;
