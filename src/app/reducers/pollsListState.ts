import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, PollsListState } from "./rootReducer";

const pollsListStateReducer: Reducer = (
  pollsListState: PollsListState = initialState.pollsListState,
  action: AnyAction
): PollsListState => {
  switch (action.type) {
    case actionTypes.TOGGLE_SHOW_RESULTS:
      return {
        ...pollsListState,
        showResults: pollsListState.showResults ? false : true
      };
    default:
      return pollsListState;
  }
};

export default pollsListStateReducer;
