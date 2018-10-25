import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";
import { generatePolls } from "../../tests/pollTestUtils";
import * as actionTypes from "../actions/action-types";
import * as api from "../api/api";
import * as sagas from "./sagas";

jest.mock("antd");

const polls = generatePolls(3);
const poll = polls[0];
const errorText = "whoops";

// getPolls.mockResolvedValue({ response: { data: { polls: generatePolls(3) } } });

describe("Testing sagas:", () => {
  describe("Testing getPolls saga", () => {
    it("getPollsSaga should put GET_POLLS_SUCCESS with polls in payload", () => {
      return (
        expectSaga(sagas.getPollsSaga)
          // Mocks the api call
          .provide([[matchers.call.fn(api.getPolls), { data: { polls } }]])
          // Checks the action that is dispatched
          .put({
            type: actionTypes.GET_POLLS_SUCCESS,
            payload: { polls }
          })
          .run()
      );
    });

    it("getPollsSaga should put GET_POLLS_ERROR with error in payload", () => {
      return expectSaga(sagas.getPollsSaga)
        .provide([
          [matchers.call.fn(api.getPolls), throwError(new Error("whoops"))]
        ])
        .put({
          type: actionTypes.GET_POLLS_ERROR,
          payload: { error: "whoops" }
        })
        .run();
    });
  });

  describe("Testing postPolls saga", () => {
    const action = {
      type: actionTypes.POST_POLLS_SUCCESS,
      payload: { poll }
    };

    it("postPollsSaga should put POST_POLLS_SUCCESS with poll in payload ", () => {
      return expectSaga(sagas.postPollsSaga, action)
        .provide([[matchers.call.fn(api.createPoll), { data: { poll } }]])
        .put({
          type: actionTypes.POST_POLLS_SUCCESS,
          payload: { poll }
        })
        .run();
    });

    it("postPollsSaga should put POST_POLLS_ERROR with error in payload", () => {
      return expectSaga(sagas.postPollsSaga, action)
        .provide([
          [matchers.call.fn(api.createPoll), throwError(new Error(errorText))]
        ])
        .put({
          type: actionTypes.POST_POLLS_ERROR,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing voteOption", () => {
    const action = {
      type: actionTypes.VOTE_OPTION_LOADING,
      payload: { pollId: "1" }
    };
    it("voteOption saga should put VOTE_OPTION_SUCCESS with poll in payload", () => {
      return expectSaga(sagas.voteOption, action)
        .provide([[matchers.call.fn(api.voteOption), { data: { poll } }]])
        .put({
          type: actionTypes.VOTE_OPTION_SUCCESS,
          payload: { poll }
        })
        .run();
    });

    it("voteOption saga should put VOTE_OPTION_ERROR with error in payload", () => {
      return expectSaga(sagas.voteOption, action)
        .provide([
          [matchers.call.fn(api.voteOption), throwError(new Error(errorText))]
        ])
        .put({
          type: actionTypes.VOTE_OPTION_ERROR,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing deletePoll", () => {
    const action = {
      type: actionTypes.DELETE_POLL_LOADING,
      payload: { userId: "1", pollId: "1" }
    };

    it("deletePoll should put DELETE_POLL_SUCCESS passing on the original payload", () => {
      return expectSaga(sagas.deletePoll, action)
        .provide([[matchers.call.fn(api.deletePoll), "not used"]])
        .put({
          type: actionTypes.DELETE_POLL_SUCCESS,
          payload: action.payload
        })
        .run();
    });

    it("deletePoll should put DELETE_POLL_ERROR with error in the payload", () => {
      return expectSaga(sagas.deletePoll, action)
        .provide([
          [matchers.call.fn(api.deletePoll), throwError(new Error(errorText))]
        ])
        .put({
          type: actionTypes.DELETE_POLL_ERROR,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing updatePoll", () => {
    const action = {
      type: actionTypes.UPDATE_POLL_LOADING,
      payload: {
        userId: "1",
        pollId: "1",
        updatePollInput: { pollName: "name" }
      }
    };

    it("updatePoll should put UPDATE_POLL_SUCCESS with new poll in the payload", () => {
      return expectSaga(sagas.updatePoll, action)
        .provide([[matchers.call.fn(api.updatePoll), { data: { poll } }]])
        .put({
          type: actionTypes.UPDATE_POLL_SUCCESS,
          payload: { poll }
        })
        .run();
    });
  });

  describe("Testing getUserData", () => {
    const user = { name: "Jed" };
    const getErrorWithStatus = (statusCode: number) => {
      const err = new Error(errorText) as Error & {
        response: { status: number };
      };
      err.response = { status: 401 };
      return err;
    };
    it("getUserData should put GET_USER_DATA_SUCCESS with user data in the payload", () => {
      return expectSaga(sagas.getUserData)
        .provide([
          [matchers.call.fn(api.getUserData), { data: { user }, status: 200 }]
        ])
        .put({
          type: actionTypes.GET_USER_DATA_SUCCESS,
          payload: { user }
        })
        .run();
    });

    it("getUserData should put GET_USER_DATA_NOT_LOGGED_IN for status of 401", () => {
      return expectSaga(sagas.getUserData)
        .provide([
          [
            matchers.call.fn(api.getUserData),
            throwError(getErrorWithStatus(401))
          ]
        ])
        .put({ type: actionTypes.GET_USER_DATA_NOT_LOGGED_IN })
        .run();
    });

    it("getUserData should put GET_USER_DATA_ERROR with error in payload", () => {
      return expectSaga(sagas.getUserData)
        .provide([
          [matchers.call.fn(api.getUserData), throwError(new Error(errorText))]
        ])
        .put({
          type: actionTypes.GET_USER_DATA_ERROR,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing closePoll", () => {
    const action = {
      type: actionTypes.CLOSE_POLL_LOADING,
      payload: { pollId: "1" }
    };
    it("closePoll should put CLOSE_POLL_SUCCESS with updated poll in payload", () => {
      return expectSaga(sagas.closePoll, action)
        .provide([[matchers.call.fn(api.closePoll), { data: { poll } }]])
        .put({ type: actionTypes.CLOSE_POLL_SUCCESS, payload: { poll } })
        .run();
    });

    it("closePoll should put CLOSE_POLL_ERROR with error in payload", () => {
      return expectSaga(sagas.closePoll, action)
        .provide([
          [matchers.call.fn(api.closePoll), throwError(new Error(errorText))]
        ])
        .put({
          type: actionTypes.CLOSE_POLL_ERROR,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing openPoll", () => {
    const action = {
      type: actionTypes.CLOSE_POLL_LOADING,
      payload: { pollId: "1" }
    };
    it("openPoll should put OPEN_POLL_SUCCESS with updated poll in payload", () => {
      return expectSaga(sagas.openPoll, action)
        .provide([[matchers.call.fn(api.openPoll), { data: { poll } }]])
        .put({ type: actionTypes.OPEN_POLL_SUCCESS, payload: { poll } })
        .run();
    });

    it("openPoll should put open_POLL_ERROR with error in payload", () => {
      return expectSaga(sagas.openPoll, action)
        .provide([
          [matchers.call.fn(api.openPoll), throwError(new Error(errorText))]
        ])
        .put({
          type: actionTypes.OPEN_POLL_ERROR,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing mainSaga", () => {
    it("should takeLatest all of the other sagas", () => {
      return expectSaga(sagas.mainSaga).run();
    });
  });
});
