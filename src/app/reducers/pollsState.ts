import { AnyAction, Reducer } from "redux";
import { ActionTypes } from "../actions/action-types";
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

function calculateNewPolls(pollsState: PollsState, action: AnyAction): Poll[] {
  const newPolls = [...pollsState.polls];
  const indexOfUpdatedPoll = newPolls.findIndex(
    poll => poll.pollId === action.payload.poll.pollId
  );
  newPolls[indexOfUpdatedPoll] = action.payload.poll;
  return newPolls;
}

const pollsStateReducer: Reducer<PollsState, AnyAction> = (
  pollsState = initialPollsState,
  action
): PollsState => {
  switch (action.type) {
    case ActionTypes.locationChanged:
      return {
        ...pollsState,
        editingPoll: null,
        showResults: {}
      };
    case ActionTypes.getPollsRequest:
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    case ActionTypes.getPollsSuccess:
      const polls: Poll[] = action.payload.polls;
      return {
        ...pollsState,
        polls,
        isLoading: false
      };
    case ActionTypes.getPollsError:
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    case ActionTypes.postPollsSuccess:
      return {
        ...pollsState,
        polls: [...pollsState.polls, action.payload.poll]
      };
    case ActionTypes.voteOptionLoading:
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    case ActionTypes.voteOptionSuccess:
    case ActionTypes.removeVoteOptionSuccess: {
      const newPolls = calculateNewPolls(pollsState, action);
      return {
        ...pollsState,
        isLoading: false,
        polls: newPolls
      };
    }
    case ActionTypes.voteOptionError:
    case ActionTypes.removeVoteOptionError:
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    case ActionTypes.toggleShowResultsLoading: {
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.toggleShowResultsError:
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    case ActionTypes.toggleShowResultsSuccess: {
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
    case ActionTypes.deletePollLoading: {
      return {
        ...pollsState,
        error: null,
        isLoading: true
      };
    }
    case ActionTypes.deletePollError: {
      return {
        ...pollsState,
        error: action.payload.error,
        isLoading: false
      };
    }
    case ActionTypes.deletePollSuccess: {
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
    case ActionTypes.updatePollLoading: {
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.updatePollSuccess: {
      const newPolls = calculateNewPolls(pollsState, action);
      return {
        ...pollsState,
        polls: newPolls,
        editingPoll: null,
        isLoading: false
      };
    }
    case ActionTypes.updatePollError: {
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    }
    case ActionTypes.showUpdatePollForm: {
      return {
        ...pollsState,
        editingPoll: action.payload.pollId
      };
    }
    case ActionTypes.discardUpdatePollForm: {
      return {
        ...pollsState,
        editingPoll: null
      };
    }
    case ActionTypes.closePollLoading: {
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.closePollSuccess: {
      const newPolls = calculateNewPolls(pollsState, action);
      return {
        ...pollsState,
        isLoading: false,
        polls: newPolls
      };
    }
    case ActionTypes.closePollError: {
      return {
        ...pollsState,
        isLoading: false,
        error: action.payload.error
      };
    }
    case ActionTypes.openPollLoading: {
      return {
        ...pollsState,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.openPollSuccess: {
      const newPolls = calculateNewPolls(pollsState, action);
      return {
        ...pollsState,
        isLoading: false,
        polls: newPolls
      };
    }
    case ActionTypes.openPollError: {
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
