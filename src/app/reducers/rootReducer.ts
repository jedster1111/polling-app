import { combineReducers } from "redux";
import { Poll, PollInput } from "../../../server/models/database";
import pollForm from "./pollForm";
import polls from "./pollsState";

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
export interface PollForm {
  data: PollInput;
  isLoading: boolean;
  error: Error | null;
}
export interface InitialState {
  pollsState: PollsState;
  pollForm: PollForm;
}
export const initialState: InitialState = {
  pollsState: {
    polls: [],
    isLoading: false,
    error: null
  },
  pollForm: {
    data: {
      creatorName: "",
      description: "",
      options: ["", "", ""],
      pollName: ""
    },
    isLoading: false,
    error: null
  }
};

const rootReducer = combineReducers({
  polls,
  pollForm
});

export default rootReducer;
