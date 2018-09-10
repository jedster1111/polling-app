import { Action, ActionCreator } from "redux";
import { ADD_ARTICLE } from "../constants/action-types";
import { Article } from "../reducers/index";

export const addArticle: ActionCreator<Action> = (article: Article) => ({
  type: ADD_ARTICLE,
  payload: article
});
