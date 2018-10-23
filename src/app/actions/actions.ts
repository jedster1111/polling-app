import { push } from "connected-react-router";
import { Action } from "redux";
import { Poll, PollInput, UpdatePollInput } from "../types";
import * as actionTypes from "./action-types";

export const fetchPolls: () => Action = () => ({
  type: actionTypes.GET_POLLS_REQUEST
});

export const createPoll: (
  pollInput: PollInput
) => Action & { payload: PollInput } = poll => {
  const cleanedPoll = { ...poll };
  const newOptions = cleanedPoll.options.filter(option => option);
  cleanedPoll.options = newOptions;
  return {
    type: actionTypes.POST_POLLS_REQUEST,
    payload: cleanedPoll
  };
};

export const changeFormData: (
  fieldId: string,
  value: string | number
) => Action & { payload: { fieldId: string; value: string | number } } = (
  fieldId,
  value
) => ({
  type: actionTypes.CHANGE_FORM_DATA,
  payload: {
    fieldId,
    value
  }
});
export const discardPoll: () => Action = () => ({
  type: actionTypes.DISCARD_FORM_DATA
});

export const voteOption: (
  userId: string,
  pollId: string,
  optionId: string
) => Action & {
  payload: { userId: string; pollId: string; optionId: string };
} = (userId, pollId, optionId) => ({
  type: actionTypes.VOTE_OPTION_LOADING,
  payload: { userId, pollId, optionId }
});

export const toggleShowResults: (
  pollId: string
) => Action & { payload: { pollId: string } } = pollId => ({
  type: actionTypes.TOGGLE_SHOW_RESULTS_LOADING,
  payload: { pollId }
});

export const addPollOption: () => Action = () => ({
  type: actionTypes.ADD_POLL_FORM_OPTION
});

export const removePollOption: (
  index: number
) => Action & { payload: { index: number } } = index => ({
  type: actionTypes.REMOVE_POLL_FORM_OPTION,
  payload: { index }
});

export const deletePoll: (
  userId: string,
  pollId: string
) => Action & {
  payload: { userId: string; pollId: string };
} = (userId, pollId) => ({
  type: actionTypes.DELETE_POLL_LOADING,
  payload: { userId, pollId }
});

export const showUpdatePollForm: (
  pollId: string,
  poll: Poll
) => Action & { payload: { pollId: string; poll: Poll } } = (pollId, poll) => ({
  type: actionTypes.SHOW_UPDATE_POLL_FORM,
  payload: { pollId, poll }
});

export const discardUpdatePollForm: () => Action = () => ({
  type: actionTypes.DISCARD_UPDATE_POLL_FORM
});

export const updatePoll: (
  userId: string,
  pollId: string,
  updatePollInput: UpdatePollInput
) => Action & {
  payload: { userId: string; pollId: string; updatePollInput: UpdatePollInput };
} = (userId, pollId, updatePollInput) => ({
  type: actionTypes.UPDATE_POLL_LOADING,
  payload: { userId, pollId, updatePollInput }
});

export const getUserData: () => Action = () => ({
  type: actionTypes.GET_USER_DATA_LOADING
});

export const navigateToPollForm: () => Action = () => push("/create-poll");

export const closePoll: (
  pollId: string
) => Action & { payload: { pollId: string } } = pollId => ({
  type: actionTypes.CLOSE_POLL_LOADING,
  payload: { pollId }
});

export const openPoll: (
  pollId: string
) => Action & { payload: { pollId: string } } = pollId => ({
  type: actionTypes.OPEN_POLL_LOADING,
  payload: { pollId }
});
