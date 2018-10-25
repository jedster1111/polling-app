import axios from "axios";
import { PollInput, UpdatePollInput } from "../types";

export function getPolls() {
  return axios.get(`/api/polls`);
}
export function createPoll(payload: { poll: PollInput }) {
  return axios.post(`/api/polls`, payload);
}
export function voteOption(payload: {
  userId: string;
  optionId: string;
  pollId: string;
}) {
  const { userId, pollId, optionId } = payload;
  return axios.post(`/api/polls/${pollId}/vote`, {
    userId,
    optionId
  });
}
export function getPoll(pollId: string) {
  return axios.get(`/api/polls/${pollId}`);
}
export function deletePoll({
  userId,
  pollId
}: {
  userId: string;
  pollId: string;
}) {
  return axios.delete(`/api/polls/${pollId}`, { data: { userId } });
}
export function updatePoll(payload: {
  userId: string;
  pollId: string;
  updatePollInput: UpdatePollInput;
}) {
  return axios.post(`/api/polls/${payload.pollId}`, {
    ...payload.updatePollInput,
    userId: payload.userId
  });
}
export function getUserData() {
  return axios.get(`/api/users/me`);
}

export function openPoll({ pollId }: { pollId: string }) {
  return axios.post(`/api/polls/${pollId}/open`);
}

export function closePoll({ pollId }: { pollId: string }) {
  return axios.post(`/api/polls/${pollId}/close`);
}
