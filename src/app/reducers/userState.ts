import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, UserState } from "./rootReducer";

const userStateReducer: Reducer = (
  userState: UserState = initialState.userState,
  action: AnyAction
): UserState => {
  switch (action.type) {
    // case actionTypes.SAVE_USER_FORM_DATA:
    //   return {
    //     ...userState,
    //     data: {
    //       ...userState.data,
    //       name: action.payload.name
    //     }
    //   };
    case actionTypes.GET_USER_DATA_LOADING:
      return {
        ...userState,
        isLoading: true,
        error: null
      };
    case actionTypes.GET_USER_DATA_SUCCESS:
      return {
        ...userState,
        data: { ...action.payload.user },
        isLoading: false,
        isLoggedIn: true
      };
    case actionTypes.GET_USER_DATA_ERROR:
      return {
        ...userState,
        isLoading: false,
        error: action.payload.error
      };
    case actionTypes.GET_USER_DATA_NOT_LOGGED_IN:
      return {
        ...userState,
        isLoading: false,
        isLoggedIn: false
      };
    default:
      return userState;
  }
};

export default userStateReducer;
