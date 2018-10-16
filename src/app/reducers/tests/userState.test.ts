import * as types from "../../actions/action-types";
import reducer, { initialUserState } from "../userState";

describe("Testing userState reducer:", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialUserState);
  });

  it("should handle GET_USER_DATA_LOADING", () => {
    expect(
      reducer(undefined, {
        type: types.GET_USER_DATA_LOADING
      })
    ).toEqual({ ...initialUserState, isLoading: true, error: null });
  });

  it("should handle GET_USER_DATA_SUCCESS", () => {
    const user = { name: "Jed", id: "1" };
    expect(
      reducer(undefined, {
        type: types.GET_USER_DATA_SUCCESS,
        payload: { user }
      })
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
      reducer(undefined, {
        type: types.GET_USER_DATA_ERROR,
        payload: { error }
      })
    ).toEqual({ ...initialUserState, isLoading: false, error });
  });

  it("should handle GET_USER_DATA_NOT_LOGGED_IN", () => {
    expect(
      reducer(undefined, {
        type: types.GET_USER_DATA_NOT_LOGGED_IN
      })
    ).toEqual({ ...initialUserState, isLoading: false, isLoggedIn: false });
  });
});
