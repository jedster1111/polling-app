import { AnyAction, combineReducers, Reducer } from "redux";
import { Poll } from "../../../server/models/database";
import { ADD_ARTICLE, ADD_POLL } from "../actions/action-types";

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
    isLoading: false
  }
};

const polls: Reducer = (
  pollsState: PollsState = initialState.polls,
  action: AnyAction
) => {
  switch (action.type) {
    case ADD_POLL:
      return {
        ...pollsState,
        polls: [...pollsState.polls, action.payload]
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
const rootReducer = combineReducers({
  articles,
  polls
});

export default rootReducer;
