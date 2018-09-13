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
    console.log(action.payload);
    const response = yield call(api.createPoll, action.payload);
    const poll: Poll = response.data.poll;
    console.log(poll);
    yield put({ type: actionTypes.POST_POLLS_SUCCESS, payload: { poll } });
    yield put({ type: actionTypes.GET_POLLS_REQUEST });
  } catch (error) {
    yield put({
      type: actionTypes.POST_POLLS_ERROR,
      payload: { error: error.response }
    });
  }
}

export function* mainSaga() {
  yield all([
    takeLatest(actionTypes.GET_POLLS_REQUEST, getPollsSaga),
    takeLatest(actionTypes.POST_POLLS_REQUEST, postPollsSaga)
  ]);
}
