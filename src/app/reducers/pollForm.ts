import { AnyAction, Reducer } from "redux";
import * as actionTypes from "../actions/action-types";
import { initialState, PollForm } from "./reducers";

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
    case actionTypes.DISCARD_FORM_DATA:
      return {
        ...pollFormState,
        data: {
          creatorName: "",
          description: "",
          pollName: "",
          options: ["", "", ""]
        }
      };
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
          creatorName: "",
          description: "",
          options: ["", "", ""],
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
    default:
      return pollFormState;
  }
};

export default pollFormReducer;
