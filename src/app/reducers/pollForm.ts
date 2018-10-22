import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";

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
  voteLimit: 1
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
    case actionTypes.CHANGE_FORM_DATA:
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
    case actionTypes.DISCARD_FORM_DATA: {
      return initialPollFormState;
    }
    case actionTypes.POST_POLLS_REQUEST:
      return {
        ...pollFormState,
        isLoading: true,
        error: null
      };
    case actionTypes.POST_POLLS_SUCCESS:
      return initialPollFormState;
    case actionTypes.POST_POLLS_ERROR:
      return {
        ...pollFormState,
        isLoading: false,
        error: action.payload.error
      };
    case actionTypes.ADD_POLL_FORM_OPTION: {
      const newOptions = [
        ...pollFormState.data.options,
        { optionId: "", value: "" }
      ];
      return {
        ...pollFormState,
        data: { ...pollFormState.data, options: newOptions }
      };
    }
    case actionTypes.REMOVE_POLL_FORM_OPTION: {
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
    case actionTypes.SHOW_UPDATE_POLL_FORM: {
      const poll = action.payload.poll;
      return {
        ...pollFormState,
        data: { ...poll },
        originalData: { ...poll }
      };
    }
    case actionTypes.UPDATE_POLL_LOADING: {
      return {
        ...pollFormState,
        isLoading: true,
        error: null
      };
    }
    case actionTypes.UPDATE_POLL_SUCCESS: {
      return {
        ...pollFormState,
        isLoading: false
      };
    }
    case actionTypes.UPDATE_POLL_ERROR: {
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
  newOptions: { optionId: string; value: string }[]
) {
  const oldVoteLimit = pollFormState.data.voteLimit;
  const newVoteLimit =
    oldVoteLimit > newOptions.length ? newOptions.length : oldVoteLimit;
  return newVoteLimit;
}
