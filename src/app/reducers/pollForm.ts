import { AnyAction, Reducer } from "redux";
import {ActionTypes} from "../actions/action-types";

export interface PollForm {
  data: PollFormInput;
  originalData: PollFormInput;
  isLoading: boolean;
  error: string | null;
}

export interface PollFormInput {
  description: string;
  pollName: string;
  options: Array<{ optionId: string; value: string }>;
  voteLimit: number;
  optionVoteLimit: number;
}

const initData = {
  description: "",
  options: [
    { optionId: "", value: "" },
    { optionId: "", value: "" },
    { optionId: "", value: "" },
    { optionId: "", value: "" }
  ],
  pollName: "",
  voteLimit: 1,
  optionVoteLimit: 1
};

export const initialPollFormState: PollForm = {
  data: initData,
  originalData: initData,
  isLoading: false,
  error: null
};

const pollFormReducer: Reducer<PollForm, AnyAction> = (
  pollFormState = initialPollFormState,
  action
): PollForm => {
  switch (action.type) {
    case ActionTypes.changeFormData:
      const { fieldId, value } = action.payload;
      if (/^(optionInput)/.test(fieldId)) {
        const newOptions = [...pollFormState.data.options];
        // need to deep clone options
        const clonedNewOptions = newOptions.map(option => ({ ...option }));
        const optionIndex = parseInt(fieldId.replace(/^(optionInput)/, ""), 10);
        clonedNewOptions[optionIndex - 1].value = value;
        return {
          ...pollFormState,
          data: {
            ...pollFormState.data,
            options: clonedNewOptions
          }
        };
      } else {
        return {
          ...pollFormState,
          data: {
            ...pollFormState.data,
            [fieldId]: value
          }
        };
      }
    case ActionTypes.discardFormData: {
      return initialPollFormState;
    }
    case ActionTypes.postPollsRequest:
      return {
        ...pollFormState,
        isLoading: true,
        error: null
      };
    case ActionTypes.postPollsSuccess:
      return initialPollFormState;
    case ActionTypes.postPollsError:
      return {
        ...pollFormState,
        isLoading: false,
        error: action.payload.error
      };
    case ActionTypes.addPollFormOption: {
      const newOptions = [
        ...pollFormState.data.options,
        { optionId: "", value: "" }
      ];
      return {
        ...pollFormState,
        data: { ...pollFormState.data, options: newOptions }
      };
    }
    case ActionTypes.removePollFormOption: {
      const newOptions = [...pollFormState.data.options];
      const indexToRemove = action.payload.index;
      newOptions.splice(indexToRemove, 1);

      const newVoteLimit = calculateNewVoteLimit(pollFormState, newOptions);

      return {
        ...pollFormState,
        data: {
          ...pollFormState.data,
          options: newOptions,
          voteLimit: newVoteLimit
        }
      };
    }
    case ActionTypes.showUpdatePollForm: {
      const poll = action.payload.poll;
      return {
        ...pollFormState,
        data: { ...poll },
        originalData: { ...poll }
      };
    }
    case ActionTypes.updatePollLoading: {
      return {
        ...pollFormState,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.updatePollSuccess: {
      return {
        ...pollFormState,
        isLoading: false
      };
    }
    case ActionTypes.updatePollError: {
      return {
        ...pollFormState,
        isLoading: false,
        error: action.payload.error
      };
    }
    default:
      return pollFormState;
  }
};

export default pollFormReducer;
function calculateNewVoteLimit(
  pollFormState: PollForm,
  newOptions: Array<{ optionId: string; value: string }>
) {
  const oldVoteLimit = pollFormState.data.voteLimit;
  const newVoteLimit =
    oldVoteLimit > newOptions.length ? newOptions.length : oldVoteLimit;
  return newVoteLimit;
}
