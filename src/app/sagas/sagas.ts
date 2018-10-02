import { AxiosError, AxiosResponse } from "axios";
import { AnyAction } from "redux";
import { all, call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../actions/action-types";
import * as api from "../api/api";
import { Poll } from "../types";

// function fetchPolls() {
//   return axios.get("http://localhost:8000/api/polls");
// }
function* getPollsSaga() {
  try {
    const response = yield call(api.getPolls);
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
  }
}
function* postPollsSaga(action: any) {
  try {
    const response = yield call(api.createPoll, action.payload);
    const poll: Poll = response.data.poll;
    yield put({ type: actionTypes.POST_POLLS_SUCCESS, payload: { poll } });
    // yield put({ type: actionTypes.GET_POLLS_REQUEST });
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
  }
}
function* voteOption(action: AnyAction) {
  try {
    const response = yield call(api.voteOption, action.payload);
    const poll: Poll = response.data.poll;
    yield put({ type: actionTypes.VOTE_OPTION_SUCCESS, payload: { poll } });
  } catch (error) {
    const err: AxiosError = error;
    const errorMessage =
      err.response && err.response.data.error
        ? err.response.data.error
        : err.message;
    yield put({
      type: actionTypes.VOTE_OPTION_ERROR,
      payload: { error: errorMessage }
    });
  }
}
function* toggleShowResults(action: AnyAction) {
  try {
    const response = yield call(api.getPoll, action.payload.pollId);
    const poll: Poll = response.data.poll;
    yield put({
      type: actionTypes.TOGGLE_SHOW_RESULTS_SUCCESS,
      payload: { poll }
    });
  } catch (error) {
    yield put({
      type: actionTypes.TOGGLE_SHOW_RESULTS_ERROR,
      payload: { error: error.message }
    });
  }
}
function* deletePoll(action: AnyAction) {
  try {
    yield call(api.deletePoll, action.payload.pollId);
    yield put({
      type: actionTypes.DELETE_POLL_SUCCESS,
      payload: action.payload
    });
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
  }
}
function* updatePoll(action: AnyAction) {
  try {
    const response = yield call(api.updatePoll, action.payload);
    const poll: Poll = response.data.poll;
    yield put({
      type: actionTypes.UPDATE_POLL_SUCCESS,
      payload: { poll }
    });
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
  }
}
function* getUserData(action: AnyAction) {
  try {
    const response: AxiosResponse = yield call(api.getUserData);
    const user = response.data.user;
    if (response.status === 200) {
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
    }
  }
}

export function* mainSaga() {
  yield all([
    takeLatest(actionTypes.GET_POLLS_REQUEST, getPollsSaga),
    takeLatest(actionTypes.POST_POLLS_REQUEST, postPollsSaga),
    takeLatest(actionTypes.VOTE_OPTION_LOADING, voteOption),
    takeLatest(actionTypes.TOGGLE_SHOW_RESULTS_LOADING, toggleShowResults),
    takeLatest(actionTypes.DELETE_POLL_LOADING, deletePoll),
    takeLatest(actionTypes.UPDATE_POLL_LOADING, updatePoll),
    takeLatest(actionTypes.GET_USER_DATA_LOADING, getUserData)
  ]);
}
