import axios from "axios";
import { PollInput } from "../../../server/models/database";

export function getPolls() {
  return axios.get(`/api/polls`);
}
export function createPoll(payload: { poll: PollInput }) {
  return axios.post(`/api/polls`, payload);
}
export function voteOption(payload: {
  voterName: string;
  optionId: string;
  pollId: string;
}) {
  const { pollId, optionId, voterName } = payload;
  return axios.post(`/api/polls/${pollId}/vote`, {
    voterName,
    optionId
  });
}
export function getPoll(pollId: string) {
  return axios.get(`/api/polls/${pollId}`);
}
export function deletePoll(pollId: string) {
  return axios.delete(`/api/polls/${pollId}`);
}
