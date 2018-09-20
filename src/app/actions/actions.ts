import { Action, ActionCreator } from "redux";
import { PollInput, UpdatePollInput } from "../../../server/models/database";
import { UserDataFormValues } from "../components/user-data-form/UserDataForm";
import * as actionTypes from "./action-types";

export const fetchPolls: ActionCreator<Action> = () => ({
  type: actionTypes.GET_POLLS_REQUEST
});
export const createPoll: ActionCreator<Action> = (poll: PollInput) => {
  const cleanedPoll = { ...poll };
  const newOptions = cleanedPoll.options.filter(option => option);
  cleanedPoll.options = newOptions;
  return {
    type: actionTypes.POST_POLLS_REQUEST,
    payload: cleanedPoll
  };
};
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
export const discardUserFormData: ActionCreator<Action> = (
  confirmedValues: string
) => ({
  type: actionTypes.DISCARD_USER_FORM_DATA,
  payload: { confirmedValues }
});
export const voteOption: ActionCreator<Action> = (
  voterName: string,
  pollId: string,
  optionId: string
) => ({
  type: actionTypes.VOTE_OPTION_LOADING,
  payload: { voterName, pollId, optionId }
});
export const toggleShowResults: ActionCreator<Action> = (pollId: string) => ({
  type: actionTypes.TOGGLE_SHOW_RESULTS_LOADING,
  payload: { pollId }
});
export const toggleChangingName: ActionCreator<Action> = () => ({
  type: actionTypes.TOGGLE_CHANGING_NAME
});
export const addPollOption: ActionCreator<Action> = () => ({
  type: actionTypes.ADD_POLL_FORM_OPTION
});
export const removePollOption: ActionCreator<Action> = (index: number) => ({
  type: actionTypes.REMOVE_POLL_FORM_OPTION,
  payload: { index }
});
export const deletePoll: ActionCreator<Action> = (pollId: string) => ({
  type: actionTypes.DELETE_POLL_LOADING,
  payload: { pollId }
});
export const updatePoll: ActionCreator<Action> = (
  pollId: string,
  updatePollInput: UpdatePollInput
) => ({
  type: actionTypes.UPDATE_POLL_LOADING,
  payload: { pollId, updatePollInput }
});
