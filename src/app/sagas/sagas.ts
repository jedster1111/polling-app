import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../actions/action-types";

// function fetchPolls() {
//   return axios.get("http://localhost:8000/api/polls");
// }
function* getPollsSaga() {
  try {
    const response = yield call(fetch, "https://localhost:8000/api/polls", {
      method: "GET"
    });
    const responseBody = response.json();
    const polls = responseBody.data.polls;
    yield put({ type: actionTypes.GET_POLLS_SUCCESS, payload: { polls } });
  } catch (error) {
    yield put({ type: actionTypes.GET_POLLS_ERROR, error });
  }
}
// function postPolls() {
//   return axios.post("http://localhost:8000/api/polls");
// }
// function* postPollsSaga() {
//   try {
//     const response = yield call(postPolls;
//   }
// }

export function* watcherSaga() {
  yield [takeLatest(actionTypes.GET_POLLS_REQUEST, getPollsSaga)];
}
