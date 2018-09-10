import { AnyAction, Reducer } from "redux";
import { ADD_ARTICLE } from "../constants/action-types";

interface ArticlesState {
  articles: Article[];
  isLoading: boolean;
}
export interface Article {
  name: string;
}

const initialState: { articles: ArticlesState } = {
  articles: {
    articles: [],
    isLoading: true
  }
};

const rootReducer: Reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_ARTICLE:
      return { ...state, articles: [...state.articles, action.payload] };
    default:
      return state;
  }
};

export default rootReducer;
