import axios from "axios";
import { Poll, PollInput, UpdatePollInput } from "../types";

export function getPolls() {
  return axios.get(`/api/polls`);
}

export function getPollsInNamespace(namespace: string) {
  return axios.get(`/api/polls/${namespace}`);
}

export function getPoll(pollId: string) {
  return axios.get(`/api/polls/${pollId}`);
}

export function createPoll(payload: { poll: PollInput }) {
  return axios.post<Poll>(`/api/polls`, payload);
}
export function voteOption(
  payload: {
    userId: string;
    optionId: string;
    pollId: string;
  },
  namespace: string
) {
  const { userId, pollId, optionId } = payload;
  return axios.post(`/api/polls/${namespace}/${pollId}/vote`, {
    userId,
    optionId
  });
}
export function removeVoteOption(
  payload: {
    userId: string;
    optionId: string;
    pollId: string;
  },
  namespace: string
) {
  const { userId, pollId, optionId } = payload;
  return axios.post(`/api/polls/${namespace}/${pollId}/remove-vote`, {
    userId,
    optionId
  });
}

export function deletePoll(
  {
    userId,
    pollId
  }: {
    userId: string;
    pollId: string;
  },
  namespace: string
) {
  return axios.delete(`/api/polls//${namespace}/${pollId}`, {
    data: { userId }
  });
}
export function updatePoll(
  payload: {
    userId: string;
    pollId: string;
    updatePollInput: UpdatePollInput;
  },
  namespace: string
) {
  return axios.post(`/api/polls/${namespace}/${payload.pollId}`, {
    ...payload.updatePollInput,
    userId: payload.userId
  });
}

export function openPoll({ pollId }: { pollId: string }, namespace: string) {
  return axios.post(`/api/polls/${namespace}/${pollId}/open`);
}

export function closePoll({ pollId }: { pollId: string }, namespace: string) {
  return axios.post(`/api/polls/${namespace}/${pollId}/close`);
}

export function getUserData() {
  return axios.get(`/api/users/me`);
}
