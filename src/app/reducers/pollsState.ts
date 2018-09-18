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
        isLoading: true,
        error: null
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
    case actionTypes.VOTE_OPTION_LOADING:
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    case actionTypes.VOTE_OPTION_SUCCESS:
      const newPolls = [...pollsState.polls];
      const indexOfUpdatedPoll = newPolls.findIndex(
        poll => poll.pollId === action.payload.poll.pollId
      );
      newPolls[indexOfUpdatedPoll] = action.payload.poll;
      return {
        ...pollsState,
        isLoading: false,
        polls: newPolls
      };
    case actionTypes.VOTE_OPTION_ERROR:
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
