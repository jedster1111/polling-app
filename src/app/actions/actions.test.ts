import { UpdatePollInput } from "../../../server/types";
import { Poll, PollInput, UpdatePollInputOption } from "../types";
import * as types from "./action-types";
import * as actions from "./actions";

describe("Testing actions:", () => {
  it("should create an action to fetch polls", () => {
    const expectedAction = {
      type: types.GET_POLLS_REQUEST
    };

    expect(actions.fetchPolls()).toEqual(expectedAction);
  });

  it("should create an action to create a poll", () => {
    const pollInput: PollInput = {
      creatorId: "creatorId",
      description: "description",
      options: ["option1", "option2", "option3"],
      pollName: "pollName",
      voteLimit: 1
    };
    const expectedAction = {
      type: types.POST_POLLS_REQUEST,
      payload: pollInput
    };

    expect(actions.createPoll(pollInput)).toEqual(expectedAction);
  });

  it("should create an action to update form data", () => {
    const formInput = { fieldId: "name", value: "banana" };
    const expectedAction = { type: types.CHANGE_FORM_DATA, payload: formInput };

    expect(actions.changeFormData(formInput.fieldId, formInput.value)).toEqual(
      expectedAction
    );
  });

  it("should create an action to discard poll form data", () => {
    const expectedAction = { type: types.DISCARD_FORM_DATA };

    expect(actions.discardPoll()).toEqual(expectedAction);
  });

  it("should create an action to vote on a poll", () => {
    const voteInput = {
      isAddingVote: true,
      userId: "userId",
      pollId: "pollId",
      optionId: "optionId"
    };
    const expectedAction = {
      type: types.VOTE_OPTION_LOADING,
      payload: voteInput
    };

    expect(
      actions.voteOption(
        voteInput.isAddingVote,
        voteInput.userId,
        voteInput.pollId,
        voteInput.optionId
      )
    ).toEqual(expectedAction);
  });

  it("should create an action to toggle if a result is showing or not", () => {
    const pollId = "pollId";
    const expectedAction = {
      type: types.TOGGLE_SHOW_RESULTS_LOADING,
      payload: { pollId }
    };

    expect(actions.toggleShowResults(pollId)).toEqual(expectedAction);
  });

  it("should create an action to add a form's poll option", () => {
    const expectedAction = { type: types.ADD_POLL_FORM_OPTION };

    expect(actions.addPollOption()).toEqual(expectedAction);
  });

  it("should create an action to remove a form's poll option", () => {
    const index = 1;
    const expectedAction = {
      type: types.REMOVE_POLL_FORM_OPTION,
      payload: { index }
    };

    expect(actions.removePollOption(index)).toEqual(expectedAction);
  });

  it("should create an action to delete a poll", () => {
    const userId = "userId";
    const pollId = "pollId";
    const expectedAction = {
      type: types.DELETE_POLL_LOADING,
      payload: { userId, pollId }
    };

    expect(actions.deletePoll(userId, pollId)).toEqual(expectedAction);
  });

  it("should create an action to show a poll's update form", () => {
    const pollId = "pollId";
    const user1 = { id: "1", userName: "userName1" };
    const poll: Poll = {
      pollName: "pollName",
      options: [
        {
          optionId: "1",
          value: "value1",
          votes: [{ ...user1, numberOfVotes: 1 }]
        }
      ],
      creator: user1,
      description: "description",
      pollId,
      voteLimit: 1,
      isOpen: true
    };
    const expectedAction = {
      type: types.SHOW_UPDATE_POLL_FORM,
      payload: { pollId, poll }
    };

    expect(actions.showUpdatePollForm(pollId, poll)).toEqual(expectedAction);
  });

  it("should create an action to discard a poll's update form", () => {
    const expectedAction = { type: types.DISCARD_UPDATE_POLL_FORM };
    expect(actions.discardUpdatePollForm()).toEqual(expectedAction);
  });

  it("should create an action to update a poll", () => {
    const userId = "userId";
    const pollId = "pollId";
    const pollName = "pollName";
    const description = "description";
    const options: UpdatePollInputOption[] = [
      { optionId: "1", value: "value1" }
    ];
    const updatePollInput: UpdatePollInput = { pollName, description, options };
    const expectedAction = {
      type: types.UPDATE_POLL_LOADING,
      payload: { userId, pollId, updatePollInput }
    };

    expect(actions.updatePoll(userId, pollId, updatePollInput)).toEqual(
      expectedAction
    );
  });

  it("should create an action that gets user data ", () => {
    const expectedAction = { type: types.GET_USER_DATA_LOADING };
    expect(actions.getUserData()).toEqual(expectedAction);
  });
});
