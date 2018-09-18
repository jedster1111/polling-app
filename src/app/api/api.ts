import axios from "axios";
import { PollInput } from "../../../server/models/database";

export function getPolls() {
  return axios.get("http://localhost:8000/api/polls");
}
export function createPoll(payload: { poll: PollInput }) {
  return axios.post("http://localhost:8000/api/polls", payload);
}
export function voteOption(payload: {
  voterName: string;
  optionId: string;
  pollId: string;
}) {
  const { pollId, optionId, voterName } = payload;
  return axios.post(`http://localhost:8000/api/polls/${pollId}/vote`, {
    voterName,
    optionId
  });
}
export function getPoll(pollId: string) {
  return axios.get(`http://localhost:8000/api/polls/${pollId}`);
}
