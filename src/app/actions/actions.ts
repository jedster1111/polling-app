import { Action, ActionCreator } from "redux";
import { Poll } from "../../../server/models/database";
import { Article } from "../reducers/reducers";
import * as actionTypes from "./action-types";
export const addArticle: ActionCreator<Action> = (article: Article) => ({
  type: actionTypes.ADD_ARTICLE,
  payload: article
});
export const addPoll: ActionCreator<Action> = (poll: Poll) => ({
  type: actionTypes.ADD_POLL,
  payload: poll
});
export const fetchPolls: ActionCreator<Action> = () => ({
  type: actionTypes.GET_POLLS_REQUEST
});
