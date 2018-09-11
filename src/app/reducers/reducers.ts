import { AnyAction, combineReducers, Reducer } from "redux";
import { PollInput } from "../../../server/models/database";
import {
  ADD_ARTICLE,
  GET_POLLS_ERROR,
  GET_POLLS_REQUEST,
  GET_POLLS_SUCCESS,
  POST_POLLS_ERROR,
  POST_POLLS_REQUEST,
  POST_POLLS_SUCCESS
} from "../actions/action-types";

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
  polls: PollInput[];
  getPolls: ApiChecks;
  postPolls: ApiChecks;
}
export interface InitialState {
  [key: string]: any;
  articles: ArticlesState;
  polls: PollsState;
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
  }
};

const polls: Reducer = (
  pollsState: PollsState = initialState.polls,
  action: AnyAction
): PollsState => {
  switch (action.type) {
    case GET_POLLS_REQUEST:
      return {
        ...pollsState,
        getPolls: { ...pollsState.getPolls, isLoading: true, error: null }
      };
    case GET_POLLS_SUCCESS:
      return {
        ...pollsState,
        polls: action.payload.polls,
        getPolls: { ...pollsState.getPolls, isLoading: false }
      };
    case GET_POLLS_ERROR:
      return {
        ...pollsState,
        getPolls: {
          ...pollsState.getPolls,
          isLoading: false,
          error: action.payload.error
        }
      };

    case POST_POLLS_REQUEST:
      return {
        ...pollsState,
        postPolls: { ...pollsState.postPolls, isLoading: true, error: null }
      };
    case POST_POLLS_SUCCESS:
      return {
        ...pollsState,
        polls: [...pollsState.polls, action.payload.poll],
        postPolls: { ...pollsState.postPolls, isLoading: false }
      };
    case POST_POLLS_ERROR:
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
    case ADD_ARTICLE:
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
  polls
});

export default reducer;
