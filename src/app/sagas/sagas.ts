import { message } from "antd";
import { AxiosError, AxiosResponse } from "axios";
import { push } from "connected-react-router";
import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { ActionTypes } from "../actions/action-types";
import {
  ClosePollAction,
  closePollError,
  closePollSuccess,
  createPollError,
  CreatePollLoadingAction,
  createPollSuccess,
  DeletePollAction,
  deletePollError,
  deletePollSuccess,
  fetchPolls,
  FetchPollsAction,
  fetchPollsError,
  fetchPollsSuccess,
  GetUserDataAction,
  getUserDataError,
  getUserDataNotLoggedIn,
  getUserDataSuccess,
  OpenPollAction,
  openPollError,
  openPollSuccess,
  removeVoteOptionError,
  removeVoteOptionSuccess,
  UpdatePollAction,
  updatePollError,
  updatePollSuccess,
  VoteOptionAction,
  voteOptionError,
  voteOptionSuccess
} from "../actions/actions";
import * as api from "../api/api";
import { Poll, User } from "../types";

export function* getPollsSaga(action: FetchPollsAction) {
  try {
    const response = yield call(
      api.getPollsInNamespace,
      action.payload.namespace
    );
    const polls: Poll[] = response.data.polls;
    yield put(fetchPollsSuccess(polls));
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put(fetchPollsError(errorMessage));

    message.error(errorMessage);
  }
}
export function* postPollsSaga(action: CreatePollLoadingAction) {
  try {
    const response = yield call(api.createPoll, action.payload);
    const poll: Poll = response.data.poll;
    yield put(createPollSuccess(poll));
    yield put(push(`/${poll.namespace}/${poll.pollId}`));

    message.success("Poll Created!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put(createPollError(errorMessage));

    message.error(errorMessage);
  }
}

export function* voteOption(action: VoteOptionAction) {
  const { isAddingVote, namespace, voteInput } = action.payload;
  try {
    const response = yield call(
      isAddingVote ? api.voteOption : api.removeVoteOption,
      voteInput,
      namespace
    );
    const poll: Poll = response.data.poll;
    if (isAddingVote) {
      yield put(voteOptionSuccess(poll));
    } else {
      yield put(removeVoteOptionSuccess(poll));
    }
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    if (isAddingVote) {
      yield put(voteOptionError(errorMessage));
    } else {
      yield put(removeVoteOptionError(errorMessage));
    }

    yield put(fetchPolls(namespace));

    message.error(errorMessage);
  }
}

export function* deletePoll(action: DeletePollAction) {
  try {
    yield call(api.deletePoll, action.payload.input, action.payload.namespace);
    yield put(deletePollSuccess(action.payload.input.pollId));

    message.success("Successfully deleted poll!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put(deletePollError(errorMessage));

    message.error(errorMessage);
  }
}
export function* updatePollSaga(action: UpdatePollAction) {
  try {
    const response = yield call(
      api.updatePoll,
      action.payload.input,
      action.payload.namespace
    );
    const poll: Poll = response.data.poll;
    yield put(updatePollSuccess(poll));

    message.success("Poll successfully updated!");
    if (poll.namespace !== action.payload.namespace) {
      yield put(push(`/${poll.namespace}/${poll.pollId}`));
    }
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put(updatePollError(errorMessage));

    message.error(errorMessage);
  }
}
export function* getUserData(action: GetUserDataAction) {
  try {
    const response: AxiosResponse = yield call(api.getUserData);
    const user: User = response.data.user;
    if (response.status === 200) {
      message.success(`Welcome ${user.displayName || user.userName}`);
      yield put(getUserDataSuccess(user));
    }
  } catch (error) {
    const err: AxiosError = error;
    if (err.response && err.response.status === 401) {
      yield put(getUserDataNotLoggedIn());
    } else {
      const errorMessage =
        err.response && err.response.data.error
          ? err.response.data.error
          : err.message;
      yield put(getUserDataError(errorMessage));

      message.error(errorMessage);
    }
  }
}
export function* closePoll(action: ClosePollAction) {
  try {
    const response: AxiosResponse = yield call(
      api.closePoll,
      action.payload.input,
      action.payload.namespace
    );
    const poll: Poll = response.data.poll;
    yield put(closePollSuccess(poll));

    message.success("Poll was successfully closed!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put(closePollError(errorMessage));

    message.error(errorMessage);
  }
}

export function* openPoll(action: OpenPollAction) {
  try {
    const response: AxiosResponse = yield call(
      api.openPoll,
      action.payload.input,
      action.payload.namespace
    );
    const poll: Poll = response.data.poll;
    yield put(openPollSuccess(poll));

    message.success("Poll was successfully opened!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put(openPollError(errorMessage));

    message.error(errorMessage);
  }
}

export function* mainSaga() {
  yield all([
    takeLatest(ActionTypes.getPollsRequest, getPollsSaga),
    takeLatest(ActionTypes.postPollsRequest, postPollsSaga),
    takeEvery(ActionTypes.voteOptionLoading, voteOption),
    takeLatest(ActionTypes.deletePollLoading, deletePoll),
    takeLatest(ActionTypes.updatePollLoading, updatePollSaga),
    takeLatest(ActionTypes.getUserDataLoading, getUserData),
    takeLatest(ActionTypes.closePollLoading, closePoll),
    takeLatest(ActionTypes.openPollLoading, openPoll)
  ]);
}
