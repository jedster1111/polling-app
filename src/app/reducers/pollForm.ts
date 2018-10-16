import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";

export interface PollForm {
  data: PollFormInput;
  isLoading: boolean;
  error: Error | null;
}

export interface PollFormInput {
  description: string;
  pollName: string;
  options: Array<{ optionId: string; value: string }>;
}

export const initialPollFormState: PollForm = {
  data: {
    description: "",
    options: [
      { optionId: "", value: "" },
      { optionId: "", value: "" },
      { optionId: "", value: "" },
      { optionId: "", value: "" }
    ],
    pollName: ""
  },
  isLoading: false,
  error: null
};

const pollFormReducer: Reducer = (
  pollFormState: PollForm = initialPollFormState,
  action: AnyAction
): PollForm => {
  switch (action.type) {
    case actionTypes.LOCATION_CHANGED: {
      return {
        ...pollFormState,
        data: { ...initialPollFormState.data }
      };
    }
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
      return {
        ...pollFormState,
        data: {
          description: "",
          pollName: "",
          options: initialPollFormState.data.options
        }
      };
    }
    case actionTypes.POST_POLLS_REQUEST:
      return {
        ...pollFormState,
        isLoading: true,
        error: null
      };
    case actionTypes.POST_POLLS_SUCCESS:
      return {
        ...pollFormState,
        data: {
          description: "",
          options: initialPollFormState.data.options,
          pollName: ""
        },
        isLoading: false,
        error: null
      };
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
      return {
        ...pollFormState,
        data: { ...pollFormState.data, options: newOptions }
      };
    }
    case actionTypes.SHOW_UPDATE_POLL_FORM: {
      const poll = action.payload.poll;
      return {
        ...pollFormState,
        data: { ...poll }
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
