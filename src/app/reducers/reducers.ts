import { AnyAction, combineReducers, Reducer } from "redux";
import { Poll, PollInput } from "../../../server/models/database";
import * as actionTypes from "../actions/action-types";

export interface ArticlesState {
  articles: Article[];
  isLoading: boolean;
}
export interface Article {
  id: string;
  title: string;
}
export interface PollsState {
  polls: Poll[];
  isLoading: boolean;
  error: Error | null;
}
export interface PollForm {
  data: PollInput;
  isLoading: boolean;
  error: Error | null;
}
export interface InitialState {
  pollsState: PollsState;
  pollForm: PollForm;
}

const initialState: InitialState = {
  pollsState: {
    polls: [],
    isLoading: false,
    error: null
  },
  pollForm: {
    data: {
      creatorName: "",
      description: "",
      options: ["", "", ""],
      pollName: ""
    },
    isLoading: false,
    error: null
  }
};

const pollForm: Reducer = (
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

const polls: Reducer = (
  pollsState: PollsState = initialState.pollsState,
  action: AnyAction
): PollsState => {
  switch (action.type) {
    case actionTypes.GET_POLLS_REQUEST:
      return {
        ...pollsState,
        isLoading: true
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
    default:
      return pollsState;
  }
};

const reducer = combineReducers({
  polls,
  pollForm
});

export default reducer;
