import * as types from "../../actions/action-types";
import { Poll, PollOption } from "../../types";
import reducer, { initialPollsState } from "../pollsState";

const generateOptions: (n: number) => PollOption[] = n => {
  const options: PollOption[] = [];
  for (let i = 0; i < n; i++) {
    options.push({
      value: `value${i + 1}`,
      optionId: `${i + 1}`,
      votes: []
    });
  }
  return options;
};
const generatePoll: (index: number) => Poll = i => ({
  pollId: `${i}`,
  pollName: `pollName${i}`,
  options: generateOptions(3),
  description: `description${i}`,
  creator: { id: `${i}`, userName: `user${i}` }
});
const generatePolls: (n: number) => Poll[] = n => {
  const polls = [];
  for (let i = 0; i < n; i++) {
    polls.push(generatePoll(i + 1));
  }
  return polls;
};

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
      reducer(initialPollsState, { type: types.LOCATION_CHANGED })
    ).toEqual({ ...initialPollsState, editingPoll: null, showResults: {} });
  });

  it("should handle GET_POLLS_REQUEST", () => {
    loadingTest(types.GET_POLLS_REQUEST);
  });

  it("should handle GET_POLLS_SUCCESS", () => {
    const polls: Poll[] = generatePolls(3);
    expect(
      reducer(
        { ...initialPollsState, isLoading: true },
        { type: types.GET_POLLS_SUCCESS, payload: { polls } }
      )
    ).toEqual({ ...initialPollsState, isLoading: false, polls });
  });

  it("should handle GET_POLLS_ERROR", () => {
    errorTest(types.GET_POLLS_ERROR);
  });

  it("should handle VOTE_OPTION_LOADING", () => {
    loadingTest(types.VOTE_OPTION_LOADING);
  });

  it("should handle VOTE_OPTION_SUCCESS", () => {
    const initPolls = generatePolls(3);

    const voter = { id: "1", userName: "jed" };

    const votedPoll = generatePoll(1);
    votedPoll.options = generateOptions(3);
    votedPoll.options[0].votes = [voter];

    const resultPolls = generatePolls(3);
    resultPolls[0].options[0].votes = [voter];

    expect(
      reducer(
        { ...initialPollsState, isLoading: true, polls: initPolls },
        { type: types.VOTE_OPTION_SUCCESS, payload: { poll: votedPoll } }
      )
    ).toEqual({ ...initialPollsState, polls: resultPolls });
  });

  it("should handle VOTE_OPTION_ERROR", () => {
    errorTest(types.VOTE_OPTION_ERROR);
  });

  it("should handle TOGGLE_SHOW_RESULTS_LOADING", () => {
    loadingTest(types.TOGGLE_SHOW_RESULTS_LOADING);
  });

  it("should handle TOGGLE_SHOW_RESULTS_ERROR", () => {
    errorTest(types.VOTE_OPTION_ERROR);
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
          type: types.TOGGLE_SHOW_RESULTS_SUCCESS,
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
    loadingTest(types.DELETE_POLL_LOADING);
  });

  it("should handle DELETE_POLL_ERROR", () => {
    errorTest(types.DELETE_POLL_ERROR);
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
        { type: types.DELETE_POLL_SUCCESS, payload: { pollId: pollIdToDelete } }
      )
    ).toEqual({ ...initialPollsState, polls: newPolls, isLoading: false });
  });

  it("should handle UPDATE_POLL_LOADING", () => {
    loadingTest(types.UPDATE_POLL_LOADING);
  });

  it("should handle UPDATE_POLL_ERROR", () => {
    errorTest(types.UPDATE_POLL_ERROR);
  });

  it("should handle UPDATE_POLL_SUCCESS", () => {
    const initPolls = generatePolls(3);

    const updatedPoll = generatePoll(1);
    updatedPoll.pollName = "changed";

    const newPolls = [updatedPoll, initPolls[1], initPolls[2]];

    expect(
      reducer(
        { ...initialPollsState, isLoading: true, polls: initPolls },
        { type: types.UPDATE_POLL_SUCCESS, payload: { poll: updatedPoll } }
      )
    ).toEqual({ ...initialPollsState, polls: newPolls });
  });

  it("should handle SHOW_UPDATE_POLL_FORM", () => {
    const pollId = "1";
    expect(
      reducer(initialPollsState, {
        type: types.SHOW_UPDATE_POLL_FORM,
        payload: { pollId }
      })
    ).toEqual({ ...initialPollsState, editingPoll: pollId });
  });

  it("should handle DISCARD_UPDATE_POLL_FORM", () => {
    expect(
      reducer(
        { ...initialPollsState, editingPoll: "2" },
        { type: types.DISCARD_UPDATE_POLL_FORM }
      )
    ).toEqual(initialPollsState);
  });
});
