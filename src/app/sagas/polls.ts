import { AnyAction } from "redux";
import { call, put } from "redux-saga/effects";
import * as actionTypes from "../actions/action-types";
import * as api from "../api/api";

export function* getPolls() {
  const response = yield call(api.getPolls);
  const payload = response ? response.data : {};
  yield put({ type: actionTypes.GET_POLLS_SUCCESS, payload });
}
export function* createPoll(action: AnyAction) {
  const response: Response = yield call(api.createPoll, action.payload);
  yield put({ type: actionTypes.POST_POLLS_SUCCESS, payload: response.body });
}
