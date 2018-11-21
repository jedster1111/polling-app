import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";
import { generatePolls } from "../../tests/pollTestUtils";
import { ActionTypes } from "../actions/action-types";
import { deletePoll, fetchPolls, fetchPollsSuccess } from "../actions/actions";
import * as api from "../api/api";
import * as sagas from "./sagas";

jest.mock("antd");

const polls = generatePolls(3);
const poll = polls[0];
const errorText = "whoops";

// getPolls.mockResolvedValue({ response: { data: { polls: generatePolls(3) } } });

describe("Testing sagas:", () => {
  describe("Testing getPolls saga", () => {
    const action = fetchPolls("namespace");
    it("getPollsSaga should put GET_POLLS_SUCCESS with polls in payload", () => {
      return (
        expectSaga(sagas.getPollsSaga, action)
          // Mocks the api call
          .provide([
            [matchers.call.fn(api.getPollsInNamespace), { data: { polls } }]
          ])
          // Checks the action that is dispatched
          .put(fetchPollsSuccess(polls))
          .run()
      );
    });

    it("getPollsSaga should put GET_POLLS_ERROR with error in payload", () => {
      return expectSaga(sagas.getPollsSaga, action)
        .provide([
          [
            matchers.call.fn(api.getPollsInNamespace),
            throwError(new Error("whoops"))
          ]
        ])
        .put({
          type: ActionTypes.getPollsError,
          payload: { error: "whoops" }
        })
        .run();
    });
  });

  describe("Testing postPolls saga", () => {
    const action = {
      type: ActionTypes.postPollsSuccess,
      payload: { poll }
    };

    it("postPollsSaga should put POST_POLLS_SUCCESS with poll in payload ", () => {
      return expectSaga(sagas.postPollsSaga, action)
        .provide([[matchers.call.fn(api.createPoll), { data: { poll } }]])
        .put({
          type: ActionTypes.postPollsSuccess,
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
          type: ActionTypes.postPollsError,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing voteOption", () => {
    describe("Testing adding votes", () => {
      const action = {
        type: ActionTypes.voteOptionLoading,
        payload: { pollId: "1", isAddingVote: true }
      };
      it("voteOption saga should put VOTE_OPTION_SUCCESS with poll in payload", () => {
        return expectSaga(sagas.voteOption, action)
          .provide([[matchers.call.fn(api.voteOption), { data: { poll } }]])
          .put({
            type: ActionTypes.voteOptionSuccess,
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
            type: ActionTypes.voteOptionError,
            payload: { error: errorText }
          })
          .run();
      });
    });

    describe("Testing removing votes", () => {
      const action = {
        type: ActionTypes.removeVoteOptionLoading,
        payload: { pollId: "1", isAddingVote: false }
      };
      it("voteOption saga should put REMOVE_VOTE_OPTION_SUCCESS with poll in payload", () => {
        return expectSaga(sagas.voteOption, action)
          .provide([
            [matchers.call.fn(api.removeVoteOption), { data: { poll } }]
          ])
          .put({
            type: ActionTypes.removeVoteOptionSuccess,
            payload: { poll }
          })
          .run();
      });

      it("voteOption saga should put REMOVE_VOTE_OPTION_ERROR with error in payload", () => {
        return expectSaga(sagas.voteOption, action)
          .provide([
            [
              matchers.call.fn(api.removeVoteOption),
              throwError(new Error(errorText))
            ]
          ])
          .put({
            type: ActionTypes.removeVoteOptionError,
            payload: { error: errorText }
          })
          .run();
      });
    });
  });

  describe("Testing deletePoll", () => {
    const action = deletePoll("1", "1", "namespace");

    it("deletePoll should put DELETE_POLL_SUCCESS passing on pollId", () => {
      return expectSaga(sagas.deletePoll, action)
        .provide([[matchers.call.fn(api.deletePoll), "not used"]])
        .put({
          type: ActionTypes.deletePollSuccess,
          payload: { pollId: action.payload.input.pollId }
        })
        .run();
    });

    it("deletePoll should put DELETE_POLL_ERROR with error in the payload", () => {
      return expectSaga(sagas.deletePoll, action)
        .provide([
          [matchers.call.fn(api.deletePoll), throwError(new Error(errorText))]
        ])
        .put({
          type: ActionTypes.deletePollError,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing updatePoll", () => {
    const action = {
      type: ActionTypes.updatePollLoading,
      payload: {
        userId: "1",
        pollId: "1",
        updatePollInput: { pollName: "name" }
      }
    };

    it("updatePoll should put UPDATE_POLL_SUCCESS with new poll in the payload", () => {
      return expectSaga(sagas.updatePollSaga, action)
        .provide([[matchers.call.fn(api.updatePoll), { data: { poll } }]])
        .put({
          type: ActionTypes.updatePollSuccess,
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
          type: ActionTypes.getUserDataSuccess,
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
        .put({ type: ActionTypes.getUserDataNotLoggedIn })
        .run();
    });

    it("getUserData should put GET_USER_DATA_ERROR with error in payload", () => {
      return expectSaga(sagas.getUserData)
        .provide([
          [matchers.call.fn(api.getUserData), throwError(new Error(errorText))]
        ])
        .put({
          type: ActionTypes.getUserDataError,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing closePoll", () => {
    const action = {
      type: ActionTypes.closePollLoading,
      payload: { pollId: "1" }
    };
    it("closePoll should put CLOSE_POLL_SUCCESS with updated poll in payload", () => {
      return expectSaga(sagas.closePoll, action)
        .provide([[matchers.call.fn(api.closePoll), { data: { poll } }]])
        .put({ type: ActionTypes.closePollSuccess, payload: { poll } })
        .run();
    });

    it("closePoll should put CLOSE_POLL_ERROR with error in payload", () => {
      return expectSaga(sagas.closePoll, action)
        .provide([
          [matchers.call.fn(api.closePoll), throwError(new Error(errorText))]
        ])
        .put({
          type: ActionTypes.closePollError,
          payload: { error: errorText }
        })
        .run();
    });
  });

  describe("Testing openPoll", () => {
    const action = {
      type: ActionTypes.closePollLoading,
      payload: { pollId: "1" }
    };
    it("openPoll should put OPEN_POLL_SUCCESS with updated poll in payload", () => {
      return expectSaga(sagas.openPoll, action)
        .provide([[matchers.call.fn(api.openPoll), { data: { poll } }]])
        .put({ type: ActionTypes.openPollSuccess, payload: { poll } })
        .run();
    });

    it("openPoll should put open_POLL_ERROR with error in payload", () => {
      return expectSaga(sagas.openPoll, action)
        .provide([
          [matchers.call.fn(api.openPoll), throwError(new Error(errorText))]
        ])
        .put({
          type: ActionTypes.openPollError,
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
