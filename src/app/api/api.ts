import axios from "axios";
import { PollInput } from "../../../server/models/database";

export function getPolls() {
  return axios.get("/api/polls");
}
export function createPoll(payload: { poll: PollInput }) {
  return axios.post("/api/polls", payload);
}
