import { ActionTypes } from "../../actions/action-types";
import reducer, { initialUserState } from "../userState";

const user = { name: "Jed", id: "1" };
describe("Testing userState reducer:", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialUserState);
  });

  it("should handle GET_USER_DATA_LOADING", () => {
    expect(
      reducer(initialUserState, {
        type: ActionTypes.getUserDataLoading
      })
    ).toEqual({ ...initialUserState, isLoading: true, error: null });
  });

  it("should handle GET_USER_DATA_SUCCESS", () => {
    expect(
      reducer(
        { ...initialUserState, isLoading: true },
        {
          type: ActionTypes.getUserDataSuccess,
          payload: { user }
        }
      )
    ).toEqual({
      ...initialUserState,
      isLoading: false,
      isLoggedIn: true,
      data: user
    });
  });

  it("should handle GET_USER_DATA_ERROR", () => {
    const error = "Whoops";
    expect(
      reducer(
        { ...initialUserState, data: user, isLoading: true, isLoggedIn: true },
        {
          type: ActionTypes.getUserDataError,
          payload: { error }
        }
      )
    ).toEqual({ ...initialUserState, error, data: user, isLoggedIn: true });
  });

  describe("should handle GET_USER_DATA_NOT_LOGGED_IN", () => {
    it("when not logged in", () => {
      expect(
        reducer(
          { ...initialUserState, isLoading: true },
          {
            type: ActionTypes.getUserDataNotLoggedIn
          }
        )
      ).toEqual({ ...initialUserState, isLoading: false, isLoggedIn: false });
    });

    it("when logged in", () => {
      expect(
        reducer(
          {
            ...initialUserState,
            isLoggedIn: true,
            isLoading: true,
            data: user
          },
          {
            type: ActionTypes.getUserDataNotLoggedIn
          }
        )
      ).toEqual({ ...initialUserState, isLoading: false, isLoggedIn: false });
    });
  });
});
