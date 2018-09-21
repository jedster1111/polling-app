import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, UserFormState } from "./rootReducer";

const userFormStateReducer: Reducer = (
  userFormState: UserFormState = initialState.userFormState,
  action: AnyAction
): UserFormState => {
  switch (action.type) {
    case actionTypes.LOCATION_CHANGED:
      return {
        ...userFormState,
        isChangingName: userFormState.data.name ? false : true
      };
    case actionTypes.CHANGE_USER_FORM_DATA:
      return {
        ...userFormState,
        data: {
          ...userFormState.data,
          [action.payload.fieldId]: action.payload.value
        }
      };
    case actionTypes.SAVE_USER_FORM_DATA:
      return {
        ...userFormState,
        isChangingName: false
      };
    case actionTypes.DISCARD_USER_FORM_DATA:
      return {
        ...userFormState,
        data: {
          ...action.payload.confirmedValues
        },
        isChangingName: false
      };
    case actionTypes.TOGGLE_CHANGING_NAME:
      return {
        ...userFormState,
        isChangingName: userFormState.isChangingName ? false : true
      };
    default:
      return userFormState;
  }
};

export default userFormStateReducer;
