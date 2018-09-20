import { combineReducers } from "redux";
import { Poll } from "../../../server/models/database";
import pollForm from "./pollForm";
import pollsState from "./pollsState";
import userFormState from "./userFormState";
import userState from "./userState";

export interface PollsState {
  polls: Poll[];
  isLoading: boolean;
  error: Error | null;
  showResults: { [pollId: string]: boolean };
}
export interface PollFormInput {
  description: string;
  pollName: string;
  options: string[];
}
export interface PollForm {
  data: PollFormInput;
  isLoading: boolean;
  error: Error | null;
}
export interface UserState {
  data: {
    name: string;
  };
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
export interface InitialState {
  pollsState: PollsState;
  pollForm: PollForm;
  userState: UserState;
  userFormState: UserFormState;
  pollsListState: PollsListState;
}
export const initialState: InitialState = {
  pollsState: {
    polls: [],
    isLoading: false,
    error: null,
    showResults: {}
  },
  pollForm: {
    data: {
      description: "",
      options: ["", "", "", "", ""],
      pollName: ""
    },
    isLoading: false,
    error: null
  },
  userState: {
    data: {
      name: ""
    }
  },
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
  userState,
  userFormState
});

export default rootReducer;