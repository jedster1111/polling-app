import { UpdatePollInput } from "../../../server/types";
import { Poll, PollInput, UpdatePollInputOption } from "../types";
import { ActionTypes } from "./action-types";
import * as actions from "./actions";

describe("Testing actions:", () => {
  const namespace = "public";
  it("should create an action to fetch polls", () => {
    const expectedAction: actions.FetchPollsAction = {
      type: ActionTypes.getPollsRequest,
      payload: { namespace }
    };

    expect(actions.fetchPolls(namespace)).toEqual(expectedAction);
  });

  it("should create an action to create a poll", () => {
    const pollInput: PollInput = {
      creatorId: "creatorId",
      description: "description",
      options: ["option1", "option2", "option3"],
      pollName: "pollName",
      voteLimit: 1,
      optionVoteLimit: 1
    };
    const expectedAction: actions.CreatePollLoadingAction = {
      type: ActionTypes.postPollsRequest,
      payload: { poll: pollInput }
    };

    expect(actions.createPoll(pollInput)).toEqual(expectedAction);
  });

  it("should create an action to update form data", () => {
    const formInput = { fieldId: "name", value: "banana" };
    const expectedAction = {
      type: ActionTypes.changeFormData,
      payload: formInput
    };

    expect(actions.changeFormData(formInput.fieldId, formInput.value)).toEqual(
      expectedAction
    );
  });

  it("should create an action to discard poll form data", () => {
    const expectedAction = { type: ActionTypes.discardFormData };

    expect(actions.discardPoll()).toEqual(expectedAction);
  });

  it("should create an action to vote on a poll", () => {
    const isAddingVote = true;
    const voteInput = {
      userId: "userId",
      pollId: "pollId",
      optionId: "optionId"
    };

    const expectedAction: actions.VoteOptionAction = {
      type: ActionTypes.voteOptionLoading,
      payload: { voteInput, isAddingVote, namespace }
    };

    expect(actions.voteOption(voteInput, isAddingVote, namespace)).toEqual(
      expectedAction
    );
  });

  it("should create an action to toggle if a result is showing or not", () => {
    const pollId = "pollId";
    const expectedAction = {
      type: ActionTypes.toggleShowResultsLoading,
      payload: { pollId }
    };

    expect(actions.toggleShowResults(pollId)).toEqual(expectedAction);
  });

  it("should create an action to add a form's poll option", () => {
    const expectedAction = { type: ActionTypes.addPollFormOption };

    expect(actions.addPollOption()).toEqual(expectedAction);
  });

  it("should create an action to remove a form's poll option", () => {
    const index = 1;
    const expectedAction = {
      type: ActionTypes.removePollFormOption,
      payload: { index }
    };

    expect(actions.removePollOption(index)).toEqual(expectedAction);
  });

  it("should create an action to delete a poll", () => {
    const userId = "userId";
    const pollId = "pollId";
    const expectedAction: actions.DeletePollAction = {
      type: ActionTypes.deletePollLoading,
      payload: { input: { userId, pollId }, namespace }
    };

    expect(actions.deletePoll(userId, pollId, namespace)).toEqual(
      expectedAction
    );
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
      isOpen: true,
      totalVotes: 3,
      optionVoteLimit: 3
    };
    const expectedAction = {
      type: ActionTypes.showUpdatePollForm,
      payload: { pollId, poll }
    };

    expect(actions.showUpdatePollForm(pollId, poll)).toEqual(expectedAction);
  });

  it("should create an action to discard a poll's update form", () => {
    const expectedAction = { type: ActionTypes.discardUpdatePollForm };
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
    const expectedAction: actions.UpdatePollAction = {
      type: ActionTypes.updatePollLoading,
      payload: { input: { userId, pollId, updatePollInput }, namespace }
    };

    expect(
      actions.updatePoll(userId, pollId, updatePollInput, namespace)
    ).toEqual(expectedAction);
  });

  it("should create an action that gets user data ", () => {
    const expectedAction = { type: ActionTypes.getUserDataLoading };
    expect(actions.getUserData()).toEqual(expectedAction);
  });
});
