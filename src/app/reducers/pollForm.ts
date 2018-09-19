import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, PollForm } from "./rootReducer";

const pollFormReducer: Reducer = (
  pollFormState: PollForm = initialState.pollForm,
  action: AnyAction
): PollForm => {
  switch (action.type) {
    case actionTypes.CHANGE_FORM_DATA:
      const { fieldId, value } = action.payload;
      if (/^(optionInput)/.test(fieldId)) {
        const newOptions = [...pollFormState.data.options];
        const optionIndex = parseInt(fieldId.replace(/^(optionInput)/, ""), 10);
        newOptions[optionIndex - 1] = value;
        return {
          ...pollFormState,
          data: {
            ...pollFormState.data,
            options: newOptions
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
          options: initialState.pollForm.data.options
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
          options: initialState.pollForm.data.options,
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
      const newOptions = [...pollFormState.data.options, ""];
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
    default:
      return pollFormState;
  }
};

export default pollFormReducer;
