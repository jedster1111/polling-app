import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, PollsState } from "./rootReducer";

const pollsStateReducer: Reducer = (
  pollsState: PollsState = initialState.pollsState,
  action: AnyAction
): PollsState => {
  switch (action.type) {
    case actionTypes.GET_POLLS_REQUEST:
      return {
        ...pollsState,
        isLoading: true
      };
    case actionTypes.GET_POLLS_SUCCESS:
      return {
        ...pollsState,
        polls: action.payload.polls,
        isLoading: false
      };
    case actionTypes.GET_POLLS_ERROR:
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    default:
      return pollsState;
  }
};

export default pollsStateReducer;
