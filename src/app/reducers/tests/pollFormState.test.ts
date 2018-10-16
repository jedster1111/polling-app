import reducer, { initialPollFormState } from "../pollForm";

describe("Testing pollForm Reducer", () => {
  it("should handle initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(
      initialPollFormState
    );
  });
});
