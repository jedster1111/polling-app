import { Action, ActionCreator } from "redux";
import { Poll } from "../../../server/models/database";
import { Article } from "../reducers/reducers";
import { ADD_ARTICLE, ADD_POLL } from "./action-types";

export const addArticle: ActionCreator<Action> = (article: Article) => ({
  type: ADD_ARTICLE,
  payload: article
});
export const addPoll: ActionCreator<Action> = (poll: Poll) => ({
  type: ADD_POLL,
  payload: poll
});
