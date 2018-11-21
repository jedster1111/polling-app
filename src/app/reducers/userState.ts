import { AnyAction, Reducer } from "redux";
import { ActionTypes } from "../actions/action-types";
import { User } from "../types";

export interface UserState {
  data: User;
  isLoading: boolean;
  error: Error | null;
  isLoggedIn: boolean;
  hasClosedWarning: boolean;
}

export const initialUserState: UserState = {
  data: {
    id: "",
    displayName: "",
    userName: ""
  },
  isLoading: false,
  error: null,
  isLoggedIn: false,
  hasClosedWarning: false
};

const userStateReducer: Reducer = (
  userState: UserState = initialUserState,
  action: AnyAction
): UserState => {
  switch (action.type) {
    case ActionTypes.getUserDataLoading:
      return {
        ...userState,
        isLoading: true,
        error: null
      };
    case ActionTypes.getUserDataSuccess:
      return {
        ...userState,
        data: { ...action.payload.user },
        isLoading: false,
        isLoggedIn: true
      };
    case ActionTypes.getUserDataError:
      return {
        ...userState,
        isLoading: false,
        error: action.payload.error
      };
    case ActionTypes.getUserDataNotLoggedIn:
      return {
        ...userState,
        isLoading: false,
        isLoggedIn: false,
        data: { ...initialUserState.data }
      };
    case ActionTypes.closedWarning:
      return {
        ...userState,
        hasClosedWarning: true
      };
    default:
      return userState;
  }
};

export default userStateReducer;
