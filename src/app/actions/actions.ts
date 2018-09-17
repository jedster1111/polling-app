import { Action, ActionCreator } from "redux";
import { PollInput } from "../../../server/models/database";
import { UserDataFormValues } from "../components/user-data-form/UserDataForm";
import { Article } from "../reducers/rootReducer";
import * as actionTypes from "./action-types";
export const addArticle: ActionCreator<Action> = (article: Article) => ({
  type: actionTypes.ADD_ARTICLE,
  payload: article
});
export const fetchPolls: ActionCreator<Action> = () => ({
  type: actionTypes.GET_POLLS_REQUEST
});
export const createPoll: ActionCreator<Action> = (poll: PollInput) => ({
  type: actionTypes.POST_POLLS_REQUEST,
  payload: poll
});
export const changeFormData: ActionCreator<Action> = (
  fieldId: string,
  value: string
) => ({
  type: actionTypes.CHANGE_FORM_DATA,
  payload: {
    fieldId,
    value
  }
});
export const discardPoll: ActionCreator<Action> = () => ({
  type: actionTypes.DISCARD_FORM_DATA
});
export const changeUserFormData: ActionCreator<Action> = (
  fieldId: string,
  value: string
) => ({
  type: actionTypes.CHANGE_USER_FORM_DATA,
  payload: {
    fieldId,
    value
  }
});
export const saveUserFormData: ActionCreator<Action> = (
  formValues: UserDataFormValues
) => ({
  type: actionTypes.SAVE_USER_FORM_DATA,
  payload: formValues
});
