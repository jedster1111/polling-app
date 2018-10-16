import * as types from "../../actions/action-types";
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
            type: types.CHANGE_FORM_DATA,
            payload: { fieldId, value }
          }
        )
      ).toEqual({
        ...initialPollFormState,
        data: { ...initialPollFormState.data, [fieldId]: value }
      });
    });

    it("when option changed", () => {
      const fieldId = "optionInput1";
      const value = "option changed";
      expect(
        reducer(
          {
            ...initialPollFormState,
            data: {
              ...initialPollFormState.data,
              options: [
                { optionId: "1", value: "value" },
                ...initialPollFormState.data.options
              ]
            }
          },
          { type: types.CHANGE_FORM_DATA, payload: { fieldId, value } }
        )
      ).toEqual({
        ...initialPollFormState,
        data: {
          ...initialPollFormState.data,
          options: [
            { optionId: "1", value },
            ...initialPollFormState.data.options
          ]
        }
      });
    });
  });

  it("should handle DISCARD_FORM_DATA", () => {
    expect(
      reducer(
        {
          ...initialPollFormState,
          data: {
            pollName: "pollName",
            description: "description",
            options: [{ optionId: "1", value: " value1" }]
          }
        },
        { type: types.DISCARD_FORM_DATA }
      )
    ).toEqual(initialPollFormState);
  });
});
