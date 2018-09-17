import { combineReducers } from "redux";
import { Poll } from "../../../server/models/database";
import pollForm from "./pollForm";
import pollsState from "./pollsState";
import userFormState from "./userFormState";
import userState from "./userState";

export interface ArticlesState {
  articles: Article[];
  isLoading: boolean;
}
export interface Article {
  id: string;
  title: string;
}
export interface PollsState {
  polls: Poll[];
  isLoading: boolean;
  error: Error | null;
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
  name: string;
}
export interface UserFormState {
  name: string;
}
export interface InitialState {
  pollsState: PollsState;
  pollForm: PollForm;
  userState: UserState;
  userFormState: UserFormState;
}
export const initialState: InitialState = {
  pollsState: {
    polls: [],
    isLoading: false,
    error: null
  },
  pollForm: {
    data: {
      description: "",
      options: ["", "", ""],
      pollName: ""
    },
    isLoading: false,
    error: null
  },
  userState: {
    name: "Unnamed"
  },
  userFormState: {
    name: ""
  }
};

const rootReducer = combineReducers({
  pollsState,
  pollForm,
  userState,
  userFormState
});

export default rootReducer;
