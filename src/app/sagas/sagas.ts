import { AnyAction } from "redux";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { Poll } from "../../../server/models/database";
import * as actionTypes from "../actions/action-types";
import * as api from "../api/api";

// function fetchPolls() {
//   return axios.get("http://localhost:8000/api/polls");
// }
function* getPollsSaga() {
  try {
    const response = yield call(api.getPolls);
    const polls: Poll[] = response.data.polls;
    yield put({ type: actionTypes.GET_POLLS_SUCCESS, payload: { polls } });
  } catch (error) {
    yield put({ type: actionTypes.GET_POLLS_ERROR, payload: { error } });
  }
}
function* postPollsSaga(action: any) {
  try {
    const response = yield call(api.createPoll, action.payload);
    const poll: Poll = response.data.poll;
    yield put({ type: actionTypes.POST_POLLS_SUCCESS, payload: { poll } });
    // yield put({ type: actionTypes.GET_POLLS_REQUEST });
  } catch (error) {
    yield put({
      type: actionTypes.POST_POLLS_ERROR,
      payload: { error }
    });
  }
}
function* voteOption(action: AnyAction) {
  try {
    const response = yield call(api.voteOption, action.payload);
    const poll: Poll = response.data.poll;
    yield put({ type: actionTypes.VOTE_OPTION_SUCCESS, payload: { poll } });
  } catch (error) {
    yield put({
      type: actionTypes.VOTE_OPTION_ERROR,
      payload: { error }
    });
  }
}

export function* mainSaga() {
  yield all([
    takeLatest(actionTypes.GET_POLLS_REQUEST, getPollsSaga),
    takeLatest(actionTypes.POST_POLLS_REQUEST, postPollsSaga),
    takeLatest(actionTypes.VOTE_OPTION_LOADING, voteOption)
  ]);
}
