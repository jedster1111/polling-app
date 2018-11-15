import { push } from "connected-react-router";
import { Action } from "redux";
import { Poll, PollInput, UpdatePollInput } from "../types";
import { ActionTypes } from "./action-types";

export interface FetchPollsAction extends Action<ActionTypes.getPollsReqest> {
  payload: { namespace: string };
}

export function fetchPolls(namespace: string): FetchPollsAction {
  return {
    type: ActionTypes.getPollsReqest,
    payload: { namespace }
  };
}

export interface CreatePollAction extends Action<ActionTypes.postPollsRequest> {
  payload: { poll: PollInput };
}

export function createPoll(pollInput: PollInput): CreatePollAction {
  const cleanedPoll = { ...pollInput };
  const newOptions = cleanedPoll.options.filter(option => option);
  cleanedPoll.options = newOptions;
  return {
    type: ActionTypes.postPollsRequest,
    payload: { poll: cleanedPoll }
  };
}

export interface ChangeFormDataAction
  extends Action<ActionTypes.changeFormData> {
  payload: { fieldId: string; value: string | number };
}

export function changeFormData(
  fieldId: string,
  value: string | number
): ChangeFormDataAction {
  return {
    type: ActionTypes.changeFormData,
    payload: {
      fieldId,
      value
    }
  };
}

export interface DiscardPollAction
  extends Action<ActionTypes.discardFormData> {}

export function discardPoll(): DiscardPollAction {
  return {
    type: ActionTypes.discardFormData
  };
}

export interface VoteOptionAction
  extends Action<ActionTypes.voteOptionLoading> {
  payload: {
    voteInput: {
      userId: string;
      pollId: string;
      optionId: string;
    };
    isAddingVote: boolean;
    namespace: string;
  };
}

export function voteOption(
  voteInput: {
    userId: string;
    pollId: string;
    optionId: string;
  },
  isAddingVote: boolean,
  namespace: string
): VoteOptionAction {
  return {
    type: ActionTypes.voteOptionLoading,
    payload: {
      voteInput,
      isAddingVote,
      namespace
    }
  };
}

export interface ToggleShowResultsAction
  extends Action<ActionTypes.toggleShowResultsLoading> {
  payload: { pollId: string };
}

export function toggleShowResults(pollId: string): ToggleShowResultsAction {
  return {
    type: ActionTypes.toggleShowResultsLoading,
    payload: { pollId }
  };
}

export interface AddPollOptionAction
  extends Action<ActionTypes.addPollFormOption> {}

export function addPollOption(): AddPollOptionAction {
  return {
    type: ActionTypes.addPollFormOption
  };
}

export interface RemovePollOptionAction
  extends Action<ActionTypes.removePollFormOption> {
  payload: { index: number };
}

export function removePollOption(index: number): RemovePollOptionAction {
  return {
    type: ActionTypes.removePollFormOption,
    payload: { index }
  };
}

export interface DeletePollAction
  extends Action<ActionTypes.deletePollLoading> {
  payload: {
    input: {
      userId: string;
      pollId: string;
    };
    namespace: string;
  };
}

export function deletePoll(
  userId: string,
  pollId: string,
  namespace: string
): DeletePollAction {
  return {
    type: ActionTypes.deletePollLoading,
    payload: { input: { userId, pollId }, namespace }
  };
}

export interface ShowUpdatePollFormAction
  extends Action<ActionTypes.showUpdatePollForm> {
  payload: { pollId: string; poll: Poll };
}

export function showUpdatePollForm(
  pollId: string,
  poll: Poll
): ShowUpdatePollFormAction {
  return {
    type: ActionTypes.showUpdatePollForm,
    payload: { pollId, poll }
  };
}

export interface DiscardUpdatePollFormAction
  extends Action<ActionTypes.discardUpdatePollForm> {}

export function discardUpdatePollForm(): DiscardUpdatePollFormAction {
  return {
    type: ActionTypes.discardUpdatePollForm
  };
}

export interface UpdatePollAction
  extends Action<ActionTypes.updatePollLoading> {
  payload: {
    input: { userId: string; pollId: string; updatePollInput: UpdatePollInput };
    namespace: string;
  };
}

export function updatePoll(
  userId: string,
  pollId: string,
  updatePollInput: UpdatePollInput,
  namespace: string
): UpdatePollAction {
  return {
    type: ActionTypes.updatePollLoading,
    payload: { input: { userId, pollId, updatePollInput }, namespace }
  };
}

export interface GetUserDataAction
  extends Action<ActionTypes.getUserDataLoading> {}

export function getUserData(): GetUserDataAction {
  return {
    type: ActionTypes.getUserDataLoading
  };
}

export interface NavigateToPollFormAction extends Action {}

export function navigateToPollForm(): NavigateToPollFormAction {
  return push("/create-poll");
}

export interface ClosePollAction extends Action<ActionTypes.closePollLoading> {
  payload: { input: { pollId: string }; namespace: string };
}

export function closePoll(pollId: string, namespace: string): ClosePollAction {
  return {
    type: ActionTypes.closePollLoading,
    payload: { input: { pollId }, namespace }
  };
}

export interface OpenPollAction extends Action<ActionTypes.openPollLoading> {
  payload: { input: { pollId: string }; namespace: string };
}

export function openPoll(pollId: string, namespace: string): OpenPollAction {
  return {
    type: ActionTypes.openPollLoading,
    payload: { input: { pollId }, namespace }
  };
}

export interface ClosedWarningAction
  extends Action<ActionTypes.closedWarning> {}

export function closedWarning(): ClosedWarningAction {
  return {
    type: ActionTypes.closedWarning
  };
}
