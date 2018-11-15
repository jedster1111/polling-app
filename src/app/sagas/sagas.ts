import { message } from "antd";
import { AxiosError, AxiosResponse } from "axios";
import { push } from "connected-react-router";
import { all, call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../actions/action-types.old";
import {
  ClosePollAction,
  CreatePollAction,
  DeletePollAction,
  fetchPolls,
  FetchPollsAction,
  GetUserDataAction,
  OpenPollAction,
  UpdatePollAction,
  VoteOptionAction
} from "../actions/actions";
import * as api from "../api/api";
import { Poll, User } from "../types";

// function fetchPolls() {
//   return axios.get("http://localhost:8000/api/polls");
// }
export function* getPollsSaga(action: FetchPollsAction) {
  try {
    const response = yield call(
      api.getPollsInNamespace,
      action.payload.namespace
    );
    const polls: Poll[] = response.data.polls;
    yield put({ type: actionTypes.GET_POLLS_SUCCESS, payload: { polls } });
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: actionTypes.GET_POLLS_ERROR,
      payload: { error: errorMessage }
    });

    message.error(errorMessage);
  }
}
export function* postPollsSaga(action: CreatePollAction) {
  try {
    const response = yield call(api.createPoll, action.payload);
    const poll: Poll = response.data.poll;
    yield put({ type: actionTypes.POST_POLLS_SUCCESS, payload: { poll } });
    yield put(push("/"));

    message.success("Poll Created!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: actionTypes.POST_POLLS_ERROR,
      payload: { error: errorMessage }
    });

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
    yield put({
      type: isAddingVote
        ? actionTypes.VOTE_OPTION_SUCCESS
        : actionTypes.REMOVE_VOTE_OPTION_SUCCESS,
      payload: { poll }
    });
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: isAddingVote
        ? actionTypes.VOTE_OPTION_ERROR
        : actionTypes.REMOVE_VOTE_OPTION_ERROR,
      payload: { error: errorMessage }
    });
    yield put(fetchPolls(namespace));

    message.error(errorMessage);
  }
}

export function* deletePoll(action: DeletePollAction) {
  try {
    yield call(api.deletePoll, action.payload.input, action.payload.namespace);
    yield put({
      type: actionTypes.DELETE_POLL_SUCCESS,
      payload: action.payload
    });

    message.success("Successfully deleted poll!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: actionTypes.DELETE_POLL_ERROR,
      payload: { error: errorMessage }
    });

    message.error(errorMessage);
  }
}
export function* updatePoll(action: UpdatePollAction) {
  try {
    const response = yield call(
      api.updatePoll,
      action.payload.input,
      action.payload.namespace
    );
    const poll: Poll = response.data.poll;
    yield put({
      type: actionTypes.UPDATE_POLL_SUCCESS,
      payload: { poll }
    });

    message.success("Poll successfully updated!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: actionTypes.UPDATE_POLL_ERROR,
      payload: { error: errorMessage }
    });

    message.error(errorMessage);
  }
}
export function* getUserData(action: GetUserDataAction) {
  try {
    const response: AxiosResponse = yield call(api.getUserData);
    const user: User = response.data.user;
    if (response.status === 200) {
      message.success(`Welcome ${user.displayName || user.userName}`);
      yield put({
        type: actionTypes.GET_USER_DATA_SUCCESS,
        payload: { user }
      });
    }
  } catch (error) {
    const err: AxiosError = error;
    if (err.response && err.response.status === 401) {
      yield put({
        type: actionTypes.GET_USER_DATA_NOT_LOGGED_IN
      });
    } else {
      const errorMessage =
        err.response && err.response.data.error
          ? err.response.data.error
          : err.message;
      yield put({
        type: actionTypes.GET_USER_DATA_ERROR,
        payload: { error: errorMessage }
      });

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
    yield put({
      type: actionTypes.CLOSE_POLL_SUCCESS,
      payload: { poll }
    });

    message.success("Poll was successfully closed!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: actionTypes.CLOSE_POLL_ERROR,
      payload: { error: errorMessage }
    });

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
    yield put({
      type: actionTypes.OPEN_POLL_SUCCESS,
      payload: { poll }
    });

    message.success("Poll was successfully opened!");
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: actionTypes.OPEN_POLL_ERROR,
      payload: { error: errorMessage }
    });

    message.error(errorMessage);
  }
}

export function* mainSaga() {
  yield all([
    takeLatest(actionTypes.GET_POLLS_REQUEST, getPollsSaga),
    takeLatest(actionTypes.POST_POLLS_REQUEST, postPollsSaga),
    takeLatest(actionTypes.VOTE_OPTION_LOADING, voteOption),
    takeLatest(actionTypes.DELETE_POLL_LOADING, deletePoll),
    takeLatest(actionTypes.UPDATE_POLL_LOADING, updatePoll),
    takeLatest(actionTypes.GET_USER_DATA_LOADING, getUserData),
    takeLatest(actionTypes.CLOSE_POLL_LOADING, closePoll),
    takeLatest(actionTypes.OPEN_POLL_LOADING, openPoll)
  ]);
}
