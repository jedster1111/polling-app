import { Action, ActionCreator } from "redux";
import { PollInput } from "../../../server/models/database";
import { Article } from "../reducers/reducers";
import * as actionTypes from "./action-types";
export const addArticle: ActionCreator<Action> = (article: Article) => ({
  type: actionTypes.ADD_ARTICLE,
  payload: article
});
export const fetchPolls: ActionCreator<Action> = () => ({
  type: actionTypes.GET_POLLS_REQUEST
});
export const createPoll: ActionCreator<Action> = (pollInput: PollInput) => ({
  type: actionTypes.POST_POLLS_REQUEST,
  payload: pollInput
});
