import { AnyAction, Reducer } from "redux";
import { ADD_ARTICLE } from "../constants/action-types";

interface ArticlesState {
  articles: Article[];
  isLoading: boolean;
}
export interface Article {
  id: string;
  title: string;
}
export interface InitialState {
  [key: string]: any;
  articles: ArticlesState;
}

const initialState: InitialState = {
  articles: {
    articles: [],
    isLoading: false
  }
};

const rootReducer: Reducer = (
  state: InitialState = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case ADD_ARTICLE:
      return {
        ...state,
        articles: {
          ...state.articles,
          articles: [...state.articles.articles, action.payload]
        }
      };
    default:
      return state;
  }
};

export default rootReducer;
