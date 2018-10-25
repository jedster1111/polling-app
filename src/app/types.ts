export interface Poll {
  creator: User;
  pollName: string;
  description: string;
  pollId: string;
  options: PollOption[];
  voteLimit: number;
  isOpen: boolean;
}
export interface User {
  id: string;
  displayName?: string;
  userName: string;
  photos?: Array<{ value: string }>;
  profileUrl?: string;
}
export interface PollOption {
  optionId: string;
  value: string;
  votes: User[];
}
export interface PollInput {
  // [key: string]: string | string[];
  creatorId?: string;
  pollName: string;
  description: string;
  options: string[];
  voteLimit: number;
}
export interface UpdatePollInput {
  pollName?: string;
  description?: string;
  options?: UpdatePollInputOption[];
  voteLimit?: number;
}
export interface UpdatePollInputOption {
  optionId: string;
  value: string;
}
