import { RouterState } from "connected-react-router";
import { combineReducers } from "redux";
import { UpdatePollInput } from "../types";
import { NamespaceState } from "./namespaceReducer";
import namespaceState from "./namespaceReducer";
import pollForm, { PollForm } from "./pollForm";
import pollsState, { PollsState } from "./pollsState";
import userState, { UserState } from "./userState";

export interface UpdatePollFormState {
  data: UpdatePollInput;
  isLoading: boolean;
  error: Error | null;
}
export interface InitialState {
  pollsState: PollsState;
  pollForm: PollForm;
  userState: UserState;
  namespaceState: NamespaceState;
}
export type StoreState = InitialState & { router: RouterState };

const rootReducer = combineReducers({
  pollsState,
  pollForm,
  userState,
  namespaceState
});

export default rootReducer;
