import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { Poll } from "../types";

export interface PollsState {
  polls: Poll[];
  isLoading: boolean;
  error: string | null;
  showResults: { [pollId: string]: boolean };
  editingPoll: null | string;
}

export const initialPollsState = {
  polls: [],
  isLoading: false,
  error: null,
  showResults: {},
  editingPoll: null
};

const calculateNewPolls: (
  pollsState: PollsState,
  action: AnyAction
) => Poll[] = (pollsState, action) => {
  const newPolls = [...pollsState.polls];
  const indexOfUpdatedPoll = newPolls.findIndex(
    poll => poll.pollId === action.payload.poll.pollId
  );
  newPolls[indexOfUpdatedPoll] = action.payload.poll;
  return newPolls;
};

const pollsStateReducer: Reducer<PollsState, AnyAction> = (
  pollsState = initialPollsState,
  action
): PollsState => {
  switch (action.type) {
    case actionTypes.LOCATION_CHANGED:
      return {
        ...pollsState,
        editingPoll: null,
        showResults: {}
      };
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
    case actionTypes.POST_POLLS_SUCCESS:
      return {
        ...pollsState,
        polls: [...pollsState.polls, action.payload.poll]
      };
    case actionTypes.VOTE_OPTION_LOADING:
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    case actionTypes.VOTE_OPTION_SUCCESS: {
      const newPolls = calculateNewPolls(pollsState, action);
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
    case actionTypes.DELETE_POLL_LOADING: {
      return {
        ...pollsState,
        error: null,
        isLoading: true
      };
    }
    case actionTypes.DELETE_POLL_ERROR: {
      return {
        ...pollsState,
        error: action.payload.error,
        isLoading: false
      };
    }
    case actionTypes.DELETE_POLL_SUCCESS: {
      const indexToRemove = pollsState.polls.findIndex(
        poll => poll.pollId === action.payload.pollId
      );
      const newPolls = [...pollsState.polls];
      if (indexToRemove !== -1) {
        newPolls.splice(indexToRemove, 1);
      }
      return {
        ...pollsState,
        isLoading: false,
        polls: newPolls
      };
    }
    case actionTypes.UPDATE_POLL_LOADING: {
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    }
    case actionTypes.UPDATE_POLL_SUCCESS: {
      const newPolls = calculateNewPolls(pollsState, action);
      return {
        ...pollsState,
        polls: newPolls,
        editingPoll: null,
        isLoading: false
      };
    }
    case actionTypes.UPDATE_POLL_ERROR: {
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    }
    case actionTypes.SHOW_UPDATE_POLL_FORM: {
      return {
        ...pollsState,
        editingPoll: action.payload.pollId
      };
    }
    case actionTypes.DISCARD_UPDATE_POLL_FORM: {
      return {
        ...pollsState,
        editingPoll: null
      };
    }
    case actionTypes.CLOSE_POLL_LOADING: {
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    }
    case actionTypes.CLOSE_POLL_SUCCESS: {
      const newPolls = calculateNewPolls(pollsState, action);
      return {
        ...pollsState,
        isLoading: false,
        polls: newPolls
      };
    }
    case actionTypes.CLOSE_POLL_ERROR: {
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    }
    default:
      return pollsState;
  }
};

export default pollsStateReducer;
