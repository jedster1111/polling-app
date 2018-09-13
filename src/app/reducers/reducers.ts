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
interface ApiChecks {
  isLoading: boolean;
  error: Error | null;
}
export interface PollsState {
  polls: Poll[];
  getPolls: ApiChecks;
  postPolls: ApiChecks;
}
export interface InitialState {
  [key: string]: any;
  articles: ArticlesState;
  polls: PollsState;
  pollFormData: PollInput;
}

const initialState: InitialState = {
  articles: {
    articles: [],
    isLoading: false
  },
  polls: {
    polls: [],
    getPolls: {
      error: null,
      isLoading: false
    },
    postPolls: {
      error: null,
      isLoading: false
    }
  },
  pollFormData: {
    creatorName: "",
    description: "",
    options: ["", "", ""],
    pollName: ""
  }
};

const pollFormData: Reducer = (
  pollFormState: PollInput = initialState.pollFormData,
  action: AnyAction
): PollInput => {
  switch (action.type) {
    case actionTypes.POST_POLLS_REQUEST:
      return {
        ...pollFormState
      };
    case actionTypes.CHANGE_FORM_DATA:
      const e: React.ChangeEvent<HTMLInputElement> = action.payload.e;
      if (/^(optionInput)/.test(e.target.id)) {
        const newOptions = [...pollFormState.options];
        const optionIndex = parseInt(
          e.target.id.replace(/^(optionInput)/, ""),
          10
        );
        newOptions[optionIndex] = e.target.value;
        return {
          ...pollFormState,
          options: newOptions
        };
      } else {
        return {
          ...pollFormState,
          [e.target.id]: e.target.value
        };
      }
    case actionTypes.DISCARD_FORM_DATA:
      return {
        creatorName: "",
        description: "",
        options: ["", "", ""],
        pollName: ""
      };
    default:
      return pollFormState;
  }
};

const polls: Reducer = (
  pollsState: PollsState = initialState.polls,
  action: AnyAction
): PollsState => {
  switch (action.type) {
    case actionTypes.GET_POLLS_REQUEST:
      return {
        ...pollsState,
        getPolls: { ...pollsState.getPolls, isLoading: true, error: null }
      };
    case actionTypes.GET_POLLS_SUCCESS:
      return {
        ...pollsState,
        polls: action.payload.polls,
        getPolls: { ...pollsState.getPolls, isLoading: false }
      };
    case actionTypes.GET_POLLS_ERROR:
      return {
        ...pollsState,
        getPolls: {
          ...pollsState.getPolls,
          isLoading: false,
          error: action.payload.error
        }
      };
    case actionTypes.POST_POLLS_SUCCESS:
      return {
        ...pollsState,
        polls: [...pollsState.polls, action.payload.poll],
        postPolls: { ...pollsState.postPolls, isLoading: false }
      };
    case actionTypes.POST_POLLS_ERROR:
      return {
        ...pollsState,
        postPolls: {
          ...pollsState.postPolls,
          isLoading: false,
          error: action.payload.error
        }
      };
    default:
      return pollsState;
  }
};
const articles: Reducer = (
  articleState: ArticlesState = initialState.articles,
  action: AnyAction
) => {
  switch (action.type) {
    case actionTypes.ADD_ARTICLE:
      return {
        ...articleState,
        articles: [...articleState.articles, action.payload]
      };
    default:
      return articleState;
  }
};
const reducer = combineReducers({
  articles,
  polls,
  pollFormData
});

export default reducer;
