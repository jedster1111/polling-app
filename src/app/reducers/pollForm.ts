import { AnyAction, Reducer } from "redux";
import { ActionTypes } from "../actions/action-types";
import {
  ChangeFormOptionDataAction,
  SetEditingAdvancedOptionAction
} from "../actions/actions";

export interface PollForm {
  data: PollFormInput;
  originalData: PollFormInput;
  isLoading: boolean;
  error: string | null;
  isEditingNamespace: boolean;
  editingAdvancedOptionIndex: number | undefined;
}

export interface PollFormInput {
  description: string;
  pollName: string;
  options: PollFormInputOption[];
  voteLimit: number;
  optionVoteLimit: number;
  namespace: string;
}

export interface PollFormInputOption {
  optionId: string;
  value: string;
  imageUrl: string;
  link: string;
}

const initData: PollFormInput = {
  description: "",
  options: [
    { optionId: "", value: "", imageUrl: "", link: "" },
    { optionId: "", value: "", imageUrl: "", link: "" },
    { optionId: "", value: "", imageUrl: "", link: "" },
    { optionId: "", value: "", imageUrl: "", link: "" }
  ],
  pollName: "",
  voteLimit: 1,
  optionVoteLimit: 1,
  namespace: "public"
};

export const initialPollFormState: PollForm = {
  data: initData,
  originalData: initData,
  isLoading: false,
  error: null,
  isEditingNamespace: false,
  editingAdvancedOptionIndex: undefined
};

const pollFormReducer: Reducer<PollForm, AnyAction> = (
  pollFormState = initialPollFormState,
  action
): PollForm => {
  switch (action.type) {
    case ActionTypes.changeFormData: {
      const { fieldId, value } = action.payload;
      return {
        ...pollFormState,
        data: {
          ...pollFormState.data,
          [fieldId]: value
        }
      };
    }

    case ActionTypes.changeFormOptionData: {
      const {
        optionIndex,
        field,
        value
      } = (action as ChangeFormOptionDataAction).payload;

      const newOptions = [...pollFormState.data.options];

      const editedOption = { ...newOptions[optionIndex], [field]: value };

      newOptions[optionIndex] = editedOption;

      return {
        ...pollFormState,
        data: {
          ...pollFormState.data,
          options: newOptions
        }
      };
    }

    case ActionTypes.discardFormData: {
      return {
        ...initialPollFormState,
        data: {
          ...initialPollFormState.data,
          namespace: action.payload.namespace
        },
        isEditingNamespace: false
      };
    }
    case ActionTypes.postPollsRequest:
      return {
        ...pollFormState,
        isLoading: true,
        error: null,
        isEditingNamespace: false
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
        { optionId: "", value: "", imageUrl: "", link: "" }
      ];
      return {
        ...pollFormState,
        data: { ...pollFormState.data, options: newOptions }
      };
    }
    case ActionTypes.removePollFormOption: {
      const newOptions = [...pollFormState.data.options];
      const indexToRemove: number = action.payload.index;
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
        error: null,
        isEditingNamespace: false
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
    case ActionTypes.changeIsEditingNamespace: {
      return {
        ...pollFormState,
        isEditingNamespace: action.payload.isEditing
      };
    }
    case ActionTypes.setEditingAdvancedOption: {
      const index = (action as SetEditingAdvancedOptionAction).payload.index;
      return {
        ...pollFormState,
        editingAdvancedOptionIndex: index
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
