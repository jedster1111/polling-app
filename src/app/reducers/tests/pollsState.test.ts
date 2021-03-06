import {
  generateOptions,
  generatePoll,
  generatePolls
} from "../../../tests/pollTestUtils";
import { ActionTypes } from "../../actions/action-types";
import { Poll } from "../../types";
import reducer, { initialPollsState } from "../pollsState";

const loadingTest: (type: string) => void = type =>
  expect(reducer({ ...initialPollsState, error: "whoops" }, { type })).toEqual({
    ...initialPollsState,
    isLoading: true,
    error: null
  });

const errorTest: (type: string) => void = type => {
  const error = "whoops";
  expect(
    reducer(
      { ...initialPollsState, isLoading: true },
      { type, payload: { error } }
    )
  ).toEqual({ ...initialPollsState, error });
};

describe("Testing pollsState reducer", () => {
  it("should handle @@INIT", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialPollsState);
  });

  it("should handle LOCATION_CHANGED", () => {
    expect(
      reducer(initialPollsState, { type: ActionTypes.locationChanged })
    ).toEqual({ ...initialPollsState, editingPoll: null, showResults: {} });
  });

  it("should handle GET_POLLS_REQUEST", () => {
    loadingTest(ActionTypes.getPollsRequest);
  });

  it("should handle GET_POLLS_SUCCESS", () => {
    const polls: Poll[] = generatePolls(3);
    expect(
      reducer(
        { ...initialPollsState, isLoading: true },
        { type: ActionTypes.getPollsSuccess, payload: { polls } }
      )
    ).toEqual({ ...initialPollsState, isLoading: false, polls });
  });

  it("should handle GET_POLLS_ERROR", () => {
    errorTest(ActionTypes.getPollsError);
  });

  it("should handle VOTE_OPTION_LOADING", () => {
    loadingTest(ActionTypes.voteOptionLoading);
  });

  it("should handle VOTE_OPTION_SUCCESS", () => {
    const initPolls = generatePolls(3);

    const voter = { id: "1", userName: "jed" };

    const votedPoll = generatePoll(1);
    votedPoll.options = generateOptions(3);
    votedPoll.options[0].votes = [{ ...voter, numberOfVotes: 1 }];

    const resultPolls = generatePolls(3);
    resultPolls[0].options[0].votes = [{ ...voter, numberOfVotes: 1 }];

    expect(
      reducer(
        { ...initialPollsState, isLoading: true, polls: initPolls },
        { type: ActionTypes.voteOptionSuccess, payload: { poll: votedPoll } }
      )
    ).toEqual({ ...initialPollsState, polls: resultPolls });
  });

  it("should handle VOTE_OPTION_ERROR", () => {
    errorTest(ActionTypes.voteOptionError);
  });

  it("should handle TOGGLE_SHOW_RESULTS_LOADING", () => {
    loadingTest(ActionTypes.toggleShowResultsLoading);
  });

  it("should handle TOGGLE_SHOW_RESULTS_ERROR", () => {
    errorTest(ActionTypes.voteOptionError);
  });

  it("should handle TOGGLE_SHOW_RESULTS_SUCCESS", () => {
    const initPolls = generatePolls(3);
    const showPoll = generatePoll(1);

    const newName = "changed";
    showPoll.pollName = newName;

    const newPolls = generatePolls(3);
    newPolls[0].pollName = newName;

    const newShowResults = { ...initialPollsState.showResults, ["1"]: true };

    expect(
      reducer(
        { ...initialPollsState, isLoading: true, polls: initPolls },
        {
          type: ActionTypes.toggleShowResultsSuccess,
          payload: { poll: showPoll }
        }
      )
    ).toEqual({
      ...initialPollsState,
      isLoading: false,
      polls: newPolls,
      showResults: newShowResults
    });
  });

  it("should handle DELETE_POLL_LOADING", () => {
    loadingTest(ActionTypes.deletePollLoading);
  });

  it("should handle DELETE_POLL_ERROR", () => {
    errorTest(ActionTypes.deletePollError);
  });

  it("should handle DELETE_POLL_SUCCESS", () => {
    const initPolls = generatePolls(3);

    const pollIdToDelete = "1";

    const newPolls = generatePolls(3);
    newPolls.splice(
      initPolls.findIndex(poll => poll.pollId === pollIdToDelete),
      1
    );

    expect(
      reducer(
        { ...initialPollsState, polls: initPolls, isLoading: true },
        {
          type: ActionTypes.deletePollSuccess,
          payload: { pollId: pollIdToDelete }
        }
      )
    ).toEqual({ ...initialPollsState, polls: newPolls, isLoading: false });
  });

  it("should handle UPDATE_POLL_LOADING", () => {
    loadingTest(ActionTypes.updatePollLoading);
  });

  it("should handle UPDATE_POLL_ERROR", () => {
    errorTest(ActionTypes.updatePollError);
  });

  it("should handle UPDATE_POLL_SUCCESS", () => {
    const initPolls = generatePolls(3);

    const updatedPoll = generatePoll(1);
    updatedPoll.pollName = "changed";

    const newPolls = [updatedPoll, initPolls[1], initPolls[2]];

    expect(
      reducer(
        { ...initialPollsState, isLoading: true, polls: initPolls },
        { type: ActionTypes.updatePollSuccess, payload: { poll: updatedPoll } }
      )
    ).toEqual({ ...initialPollsState, polls: newPolls });
  });

  it("should handle SHOW_UPDATE_POLL_FORM", () => {
    const pollId = "1";
    expect(
      reducer(initialPollsState, {
        type: ActionTypes.showUpdatePollForm,
        payload: { pollId }
      })
    ).toEqual({ ...initialPollsState, editingPoll: pollId });
  });

  it("should handle DISCARD_UPDATE_POLL_FORM", () => {
    expect(
      reducer(
        { ...initialPollsState, editingPoll: "2" },
        { type: ActionTypes.discardUpdatePollForm }
      )
    ).toEqual(initialPollsState);
  });

  it("should handle CLOSE_POLL_LOADING", () => {
    loadingTest(ActionTypes.closePollLoading);
  });

  it("should handle CLOSE_POLL_ERROR", () => {
    errorTest(ActionTypes.closePollError);
  });

  it("should handle CLOSE_POLL_SUCCESS", () => {
    const initPolls = generatePolls(3);

    const updatedPoll = generatePoll(1);
    updatedPoll.isOpen = false;

    const newPolls = [updatedPoll, initPolls[1], initPolls[2]];

    expect(
      reducer(
        { ...initialPollsState, isLoading: true, polls: initPolls },
        { type: ActionTypes.closePollSuccess, payload: { poll: updatedPoll } }
      )
    ).toEqual({ ...initialPollsState, polls: newPolls });
  });

  it("should handle OPEN_POLL_LOADING", () => {
    loadingTest(ActionTypes.openPollLoading);
  });

  it("should handle OPEN_POLL_ERROR", () => {
    errorTest(ActionTypes.openPollError);
  });

  it("should handle OPEN_POLL_SUCCESS", () => {
    const initPolls = generatePolls(3);

    const updatedPoll = generatePoll(1);
    updatedPoll.isOpen = false;

    const newPolls = [updatedPoll, initPolls[1], initPolls[2]];

    expect(
      reducer(
        { ...initialPollsState, isLoading: true, polls: initPolls },
        { type: ActionTypes.openPollSuccess, payload: { poll: updatedPoll } }
      )
    ).toEqual({ ...initialPollsState, polls: newPolls });
  });
});
