import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_POLLS_ERROR,
  GET_POLLS_REQUEST,
  GET_POLLS_SUCCESS
} from "../actions/action-types";

function fetchPolls() {
  return axios.get("http://localhost:8000/api/polls");
}
function* workerSaga() {
  try {
    const response = yield call(fetchPolls);
    const polls = response.data.polls;
    yield put({ type: GET_POLLS_SUCCESS, payload: { polls } });
    console.log("Sent GET_POLLS_SUCCESS out");
  } catch (error) {
    yield put({ type: GET_POLLS_ERROR, error });
  }
}

export function* watcherSaga() {
  yield takeLatest(GET_POLLS_REQUEST, workerSaga);
}
