import { combineReducers } from "redux";
import { Poll, UpdatePollInput } from "../../../server/models/database";
import pollForm from "./pollForm";
import pollsState from "./pollsState";
import updatePollFormState from "./updatePollFormState";
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
  updatePollFormState: UpdatePollFormState;
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
  updatePollFormState: {
    data: {
      pollName: "",
      description: "",
      options: []
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
  userFormState,
  updatePollFormState
});

export default rootReducer;
