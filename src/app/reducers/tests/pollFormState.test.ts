import { ActionTypes } from "../../actions/action-types";
import { discardPoll } from "../../actions/actions";
import { Poll } from "../../types";
import reducer, { initialPollFormState } from "../pollForm";

describe("Testing pollForm Reducer", () => {
  it("should handle initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(
      initialPollFormState
    );
  });

  describe("should handle CHANGE_FORM_DATA", () => {
    it("when non option change", () => {
      const fieldId = "pollName";
      const value = "valueChanged";
      expect(
        reducer(
          {
            ...initialPollFormState,
            data: { ...initialPollFormState.data, [fieldId]: "initialValue" }
          },
          {
            type: ActionTypes.changeFormData,
            payload: { fieldId, value }
          }
        )
      ).toEqual({
        ...initialPollFormState,
        data: { ...initialPollFormState.data, [fieldId]: value }
      });
    });

    it("when option changed", () => {
      const value = "option changed";
      expect(
        reducer(
          {
            ...initialPollFormState,
            data: {
              ...initialPollFormState.data,
              options: [
                { optionId: "1", value: "value", link: "", imageUrl: "" },
                ...initialPollFormState.data.options
              ]
            }
          },
          {
            type: ActionTypes.changeFormOptionData,
            payload: { optionIndex: 0, field: "value", value }
          }
        )
      ).toEqual({
        ...initialPollFormState,
        data: {
          ...initialPollFormState.data,
          options: [
            { optionId: "1", value, link: "", imageUrl: "" },
            ...initialPollFormState.data.options
          ]
        }
      });
    });
  });

  it("should handle DISCARD_FORM_DATA", () => {
    const namespace = "namespace";
    expect(
      reducer(
        {
          ...initialPollFormState,
          data: {
            pollName: "pollName",
            description: "description",
            options: [
              { optionId: "1", value: " value1", imageUrl: "", link: "" }
            ],
            voteLimit: 1,
            optionVoteLimit: 1,
            namespace: "namespaceChanged"
          }
        },
        discardPoll(namespace)
      )
    ).toEqual({
      ...initialPollFormState,
      data: { ...initialPollFormState.data, namespace }
    });
  });

  it("should handle POST_POLLS_REQUEST", () => {
    expect(
      reducer(
        { ...initialPollFormState, error: "Error" },
        {
          type: ActionTypes.postPollsRequest
        }
      )
    ).toEqual({ ...initialPollFormState, isLoading: true, error: null });
  });

  it("should handle POST_POLLS_SUCCESS", () => {
    expect(
      reducer(
        { ...initialPollFormState, isLoading: true },
        { type: ActionTypes.postPollsSuccess }
      )
    ).toEqual(initialPollFormState);
  });

  it("should handle POST_POLLS_ERROR", () => {
    const error = "error";
    expect(
      reducer(
        { ...initialPollFormState, isLoading: true },
        { type: ActionTypes.postPollsError, payload: { error } }
      )
    ).toEqual({ ...initialPollFormState, error });
  });

  it("should handle ADD_POLL_FORM_OPTION", () => {
    const data = initialPollFormState.data;
    const options = data.options;
    expect(
      reducer(initialPollFormState, { type: ActionTypes.addPollFormOption })
    ).toEqual({
      ...initialPollFormState,
      data: {
        ...data,
        options: [
          ...options,
          { optionId: "", value: "", imageUrl: "", link: "" }
        ]
      }
    });
  });

  it("should handle REMOVE_POLL_FORM_OPTION", () => {
    const index = 1;
    const options = [...initialPollFormState.data.options];
    options.splice(index, 1);
    expect(
      reducer(initialPollFormState, {
        type: ActionTypes.removePollFormOption,
        payload: { index }
      })
    ).toEqual({
      ...initialPollFormState,
      data: { ...initialPollFormState.data, options }
    });
  });

  it("should handle SHOW_UPDATE_POLL_FORM", () => {
    const creator = { id: "1", userName: "jed" };
    const poll: Poll = {
      creator,
      description: "description",
      options: [
        {
          optionId: "1",
          value: "option1",
          votes: [{ ...creator, numberOfVotes: 1 }]
        }
      ],
      pollId: "1",
      pollName: "pollName",
      voteLimit: 1,
      isOpen: true,
      totalVotes: 4,
      totalVoters: 2,
      optionVoteLimit: 4,
      namespace: "public"
    };
    expect(
      reducer(initialPollFormState, {
        type: ActionTypes.showUpdatePollForm,
        payload: { poll }
      })
    ).toEqual({ ...initialPollFormState, data: poll, originalData: poll });
  });

  it("should handle UPDATE_POLL_LOADING", () => {
    expect(
      reducer(
        { ...initialPollFormState, error: "whoops" },
        { type: ActionTypes.updatePollLoading }
      )
    ).toEqual({ ...initialPollFormState, isLoading: true, error: null });
  });

  it("should handle UPDATE_POLL_SUCCESS", () => {
    expect(
      reducer(
        { ...initialPollFormState, isLoading: true },
        { type: ActionTypes.updatePollSuccess }
      )
    ).toEqual(initialPollFormState);
  });

  it("should handle UPDATE_POLL_ERROR", () => {
    const error = "whoops";
    expect(
      reducer(
        { ...initialPollFormState, isLoading: true },
        { type: ActionTypes.updatePollError, payload: { error } }
      )
    ).toEqual({ ...initialPollFormState, error });
  });
});
