import axios from "axios";
import { PollInput } from "../../../server/models/database";

export function getPolls() {
  return axios.get("http://localhost:8000/api/polls");
}
export function createPoll(payload: { poll: PollInput }) {
  return axios.post("http://localhost:8000/api/polls", payload);
}
