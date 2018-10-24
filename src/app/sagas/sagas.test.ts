import { expectSaga } from "redux-saga-test-plan";
import { generatePolls } from "../../tests/pollTestUtils";
import * as actionTypes from "../actions/action-types";
// import { getPolls } from "../api/api";
import * as sagas from "./sagas";

const polls = generatePolls(3);

jest.mock("../api/api", () => ({
  getPolls: () =>
    Promise.resolve({
      data: {
        polls
      }
    })
}));
jest.mock("antd");

// getPolls.mockResolvedValue({ response: { data: { polls: generatePolls(3) } } });

describe("Testing sagas:", () => {
  it("should handle getPollsSaga success", () => {
    return expectSaga(sagas.getPollsSaga)
      .put({
        type: actionTypes.GET_POLLS_SUCCESS,
        payload: { polls: generatePolls(3) }
      })
      .dispatch({ type: actionTypes.GET_POLLS_REQUEST })
      .run();
  });
});
