import { push, RouterAction } from "connected-react-router";
import { Action } from "redux";
import UrlSafeString from "url-safe-string";
import { Poll, PollInput, UpdatePollInput, User } from "../types";
import { ActionTypes } from "./action-types";

const { generate: makeStringUrlSafe } = UrlSafeString();

export interface SuccessActionWithPoll<Type> extends Action<Type> {
  payload: { poll: Poll };
}

export interface SuccessActionWithPolls<Type> extends Action<Type> {
  payload: { polls: Poll[] };
}

export interface ErrorAction<Type> extends Action<Type> {
  payload: { error: string };
}

function successPollActionCreatorFactory(
  type: ActionTypes
): (poll: Poll) => SuccessActionWithPoll<typeof type> {
  return (poll: Poll) => ({ type, payload: { poll } });
}

function successPollsActionCreatorFactory(
  type: ActionTypes
): (polls: Poll[]) => SuccessActionWithPolls<typeof type> {
  return (polls: Poll[]) => ({ type, payload: { polls } });
}

function errorActionCreatorFactory(
  type: ActionTypes
): (error: string) => ErrorAction<typeof type> {
  return error => ({ type, payload: { error } });
}

function namespaceClean(namespace: string | undefined): string {
  if (!namespace) {
    return "public";
  }
  return makeStringUrlSafe(namespace) || "public";
}

export interface FetchPollsAction extends Action<ActionTypes.getPollsRequest> {
  payload: { namespace: string };
}

export function fetchPolls(namespace: string): FetchPollsAction {
  return {
    type: ActionTypes.getPollsRequest,
    payload: { namespace: namespaceClean(namespace) }
  };
}

export const fetchPollsSuccess = successPollsActionCreatorFactory(
  ActionTypes.getPollsSuccess
);
export const fetchPollsError = errorActionCreatorFactory(
  ActionTypes.getPollsError
);

export interface CreatePollLoadingAction
  extends Action<ActionTypes.postPollsRequest> {
  payload: { poll: PollInput };
}

export function createPoll(pollInput: PollInput): CreatePollLoadingAction {
  const cleanedPoll = { ...pollInput };
  const newOptions = cleanedPoll.options.filter(option => option);
  cleanedPoll.options = newOptions;
  return {
    type: ActionTypes.postPollsRequest,
    payload: { poll: cleanedPoll }
  };
}
export const createPollSuccess = successPollActionCreatorFactory(
  ActionTypes.postPollsSuccess
);
export const createPollError = errorActionCreatorFactory(
  ActionTypes.postPollsError
);

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

export interface DiscardPollAction extends Action<ActionTypes.discardFormData> {
  payload: { namespace: string };
}

export function discardPoll(namespace?: string): DiscardPollAction {
  return {
    type: ActionTypes.discardFormData,
    payload: { namespace: namespaceClean(namespace) }
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
      namespace: namespaceClean(namespace)
    }
  };
}

export const voteOptionSuccess = successPollActionCreatorFactory(
  ActionTypes.voteOptionSuccess
);
export const voteOptionError = errorActionCreatorFactory(
  ActionTypes.voteOptionError
);

export const removeVoteOptionSuccess = successPollActionCreatorFactory(
  ActionTypes.removeVoteOptionSuccess
);
export const removeVoteOptionError = errorActionCreatorFactory(
  ActionTypes.removeVoteOptionError
);

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
    payload: {
      input: { userId, pollId },
      namespace: namespaceClean(namespace)
    }
  };
}

export interface DeletePollSuccessAction
  extends Action<ActionTypes.deletePollSuccess> {
  payload: { pollId: string };
}

export function deletePollSuccess(pollId: string): DeletePollSuccessAction {
  return {
    type: ActionTypes.deletePollSuccess,
    payload: { pollId }
  };
}
export const deletePollError = errorActionCreatorFactory(
  ActionTypes.deletePollError
);

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
    payload: {
      input: { userId, pollId, updatePollInput },
      namespace: namespaceClean(namespace)
    }
  };
}

export const updatePollSuccess = successPollActionCreatorFactory(
  ActionTypes.updatePollSuccess
);
export const updatePollError = errorActionCreatorFactory(
  ActionTypes.updatePollError
);

export interface GetUserDataAction
  extends Action<ActionTypes.getUserDataLoading> {}

export function getUserData(): GetUserDataAction {
  return {
    type: ActionTypes.getUserDataLoading
  };
}

export interface GetUserDataSuccessAction
  extends Action<ActionTypes.getUserDataSuccess> {
  payload: { user: User };
}

export function getUserDataSuccess(user: User): GetUserDataSuccessAction {
  return {
    type: ActionTypes.getUserDataSuccess,
    payload: { user }
  };
}

export function getUserDataError(
  error: string
): ErrorAction<ActionTypes.getUserDataError> {
  return {
    type: ActionTypes.getUserDataError,
    payload: { error }
  };
}

export interface GetUserDataNotLoggedInAction
  extends Action<ActionTypes.getUserDataNotLoggedIn> {}

export function getUserDataNotLoggedIn(): GetUserDataNotLoggedInAction {
  return {
    type: ActionTypes.getUserDataNotLoggedIn
  };
}

export interface NavigateToPollFormAction extends RouterAction {}

export function navigateToPollForm(): NavigateToPollFormAction {
  return push("/create-poll");
}

export interface ClosePollAction extends Action<ActionTypes.closePollLoading> {
  payload: { input: { pollId: string }; namespace: string };
}

export function closePoll(pollId: string, namespace: string): ClosePollAction {
  return {
    type: ActionTypes.closePollLoading,
    payload: { input: { pollId }, namespace: namespaceClean(namespace) }
  };
}

export const closePollSuccess = successPollActionCreatorFactory(
  ActionTypes.closePollSuccess
);
export const closePollError = errorActionCreatorFactory(
  ActionTypes.closePollError
);

export interface OpenPollAction extends Action<ActionTypes.openPollLoading> {
  payload: { input: { pollId: string }; namespace: string };
}

export function openPoll(pollId: string, namespace: string): OpenPollAction {
  return {
    type: ActionTypes.openPollLoading,
    payload: { input: { pollId }, namespace: namespaceClean(namespace) }
  };
}

export const openPollSuccess = successPollActionCreatorFactory(
  ActionTypes.openPollSuccess
);
export const openPollError = errorActionCreatorFactory(
  ActionTypes.openPollError
);

export interface ClosedWarningAction
  extends Action<ActionTypes.closedWarning> {}

export function closedWarning(): ClosedWarningAction {
  return {
    type: ActionTypes.closedWarning
  };
}

export function navigateToPoll(namespace: string, pollId: string) {
  return push(`/${namespaceClean(namespace)}/${pollId}`);
}

export type NamespaceActions =
  | ChangeNamespaceFormAction
  | UpdateNamespaceAction
  | DiscardNamespaceAction;

export type FieldId = "namespace";
export interface ChangeNamespaceFormAction
  extends Action<ActionTypes.changeNamespaceForm> {
  payload: { fieldId: FieldId; value: string };
}

export function changeNamespaceForm(
  fieldId: FieldId,
  value: string
): ChangeNamespaceFormAction {
  return {
    type: ActionTypes.changeNamespaceForm,
    payload: { fieldId, value }
  };
}

export interface UpdateNamespaceAction
  extends Action<ActionTypes.updateNamespace> {
  payload: { namespace: string };
}

export function updateNamespace(namespace: string): UpdateNamespaceAction {
  return {
    type: ActionTypes.updateNamespace,
    payload: { namespace: namespaceClean(namespace) }
  };
}

export interface DiscardNamespaceAction
  extends Action<ActionTypes.discardNamespaceForm> {
  payload: { namespace: string };
}

export function discardNamespaceForm(
  namespace: string
): DiscardNamespaceAction {
  return { type: ActionTypes.discardNamespaceForm, payload: { namespace } };
}

export function navigateToNamespace(namespace: string): RouterAction {
  return push(`/${namespaceClean(namespace)}`);
}
