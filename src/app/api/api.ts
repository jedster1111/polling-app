import axios from "axios";
import { PollInput, UpdatePollInput } from "../types";

export function getPolls() {
  return axios.get(`/api/polls`);
}
export function createPoll(payload: { poll: PollInput }) {
  return axios.post(`/api/polls`, payload);
}
export function voteOption(payload: { optionId: string; pollId: string }) {
  const { pollId, optionId } = payload;
  return axios.post(`/api/polls/${pollId}/vote`, {
    optionId
  });
}
export function getPoll(pollId: string) {
  return axios.get(`/api/polls/${pollId}`);
}
export function deletePoll(pollId: string) {
  return axios.delete(`/api/polls/${pollId}`);
}
export function updatePoll(payload: {
  pollId: string;
  updatePollInput: UpdatePollInput;
}) {
  return axios.post(`/api/polls/${payload.pollId}`, payload.updatePollInput);
}
export function getUserData() {
  return axios.get(`/api/users/me`);
}
