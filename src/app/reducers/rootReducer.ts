import { RouterState } from "connected-react-router";
import { combineReducers } from "redux";
import { Poll, UpdatePollInput, User } from "../types";
import pollForm from "./pollForm";
import pollsState from "./pollsState";
import userState, { initialUserState } from "./userState";

export interface PollsState {
  polls: Poll[];
  isLoading: boolean;
  error: Error | null;
  showResults: { [pollId: string]: boolean };
  editingPoll: null | string;
}
export interface PollFormInput {
  description: string;
  pollName: string;
  options: Array<{ optionId: string; value: string }>;
}
export interface PollForm {
  data: PollFormInput;
  isLoading: boolean;
  error: Error | null;
}
export interface UserState {
  data: User;
  isLoading: boolean;
  error: Error | null;
  isLoggedIn: boolean;
}
export interface UserFormState {
  data: {
    name: string;
  };
  isChangingName: boolean;
}
export interface PollsListState {
  showResults: boolean;
}
export interface UpdatePollFormState {
  data: UpdatePollInput;
  isLoading: boolean;
  error: Error | null;
}
export interface InitialState {
  pollsState: PollsState;
  pollForm: PollForm;
  userState: UserState;
  userFormState: UserFormState;
  pollsListState: PollsListState;
}
export type StoreState = InitialState & { router: RouterState };
export const initialState: InitialState = {
  pollsState: {
    polls: [],
    isLoading: false,
    error: null,
    showResults: {},
    editingPoll: null
  },
  pollForm: {
    data: {
      description: "",
      options: [
        { optionId: "", value: "" },
        { optionId: "", value: "" },
        { optionId: "", value: "" },
        { optionId: "", value: "" }
      ],
      pollName: ""
    },
    isLoading: false,
    error: null
  },
  userState: initialUserState,
  userFormState: {
    data: {
      name: ""
    },
    isChangingName: true
  },
  pollsListState: {
    showResults: false
  }
};

const rootReducer = combineReducers({
  pollsState,
  pollForm,
  userState
});

export default rootReducer;
