import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { Poll } from "./../../../server/models/database";
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
      const polls: Poll[] = action.payload.polls;
      return {
        ...pollsState,
        polls,
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
    case actionTypes.VOTE_OPTION_SUCCESS: {
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
    }
    case actionTypes.VOTE_OPTION_ERROR:
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    case actionTypes.TOGGLE_SHOW_RESULTS_LOADING: {
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    }
    case actionTypes.TOGGLE_SHOW_RESULTS_ERROR:
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    case actionTypes.TOGGLE_SHOW_RESULTS_SUCCESS: {
      const pollId = action.payload.poll.pollId;
      const pollShowResult = pollsState.showResults[pollId];
      const indexOfUpdatedPoll = pollsState.polls.findIndex(
        poll => poll.pollId === pollId
      );
      const newPolls = [...pollsState.polls];
      newPolls[indexOfUpdatedPoll] = action.payload.poll;
      return {
        ...pollsState,
        polls: newPolls,
        showResults: {
          ...pollsState.showResults,
          [pollId]: pollShowResult ? false : true
        },
        isLoading: false
      };
    }
    default:
      return pollsState;
  }
};

export default pollsStateReducer;
