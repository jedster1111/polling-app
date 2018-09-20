import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, UpdatePollFormState } from "./rootReducer";

const updatePollFormStateReducer: Reducer = (
  updatePollFormState: UpdatePollFormState = initialState.updatePollFormState,
  action: AnyAction
): UpdatePollFormState => {
  switch (action.type) {
    case actionTypes.UPDATE_POLL_LOADING:
      return {
        ...updatePollFormState,
        isLoading: true,
        error: null
      };
    case actionTypes.UPDATE_POLL_SUCCESS:
      return {
        ...updatePollFormState,
        isLoading: false,
        data: initialState.updatePollFormState.data
      };
    case actionTypes.UPDATE_POLL_ERROR:
      return {
        ...updatePollFormState,
        isLoading: false,
        error: action.payload.error
      };
    default:
      return updatePollFormState;
  }
};

export default updatePollFormStateReducer;
