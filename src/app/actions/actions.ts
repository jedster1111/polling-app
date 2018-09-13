import { Action, ActionCreator } from "redux";
import { Article } from "../reducers/reducers";
import * as actionTypes from "./action-types";
export const addArticle: ActionCreator<Action> = (article: Article) => ({
  type: actionTypes.ADD_ARTICLE,
  payload: article
});
export const fetchPolls: ActionCreator<Action> = () => ({
  type: actionTypes.GET_POLLS_REQUEST
});
export const createPoll: ActionCreator<Action> = (
  e: React.FormEvent<HTMLFormElement>
) => ({
  type: actionTypes.POST_POLLS_REQUEST,
  payload: e
});
export const changeFormData: ActionCreator<Action> = (
  e: React.ChangeEvent<HTMLInputElement>
) => ({
  type: actionTypes.CHANGE_FORM_DATA,
  payload: e
});
export const discardPoll: ActionCreator<Action> = () => ({
  type: actionTypes.DISCARD_FORM_DATA
});
