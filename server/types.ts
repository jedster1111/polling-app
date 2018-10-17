export interface CreatePollRequest {
  pollName: string;
  description: string;
  options: string[];
  voteLimit: number;
}

/**
 * The format the database is expecting polls' data to be in.
 * @param options should be an array of the text values for the options.
 */
export interface PollInput {
  // [key: string]: string | string[];
  creatorId: string;
  pollName: string;
  description: string;
  options: string[];
  voteLimit: number;
}
/**
 * The format a poll is actually stored in the database as, not including Loki property.
 */
export interface Poll {
  creatorId: string;
  pollName: string;
  description: string;
  pollId: string;
  options: StoredPollOptions[];
  voteLimit: number;
}
export interface StoredPoll extends Poll {
  $loki: string;
}
/**
 * @param votes refers to the id of the user that voted.
 */
export interface StoredPollOptions {
  optionId: string;
  value: string;
  votes: string[];
}
/**
 * The format a poll should be in when it is sent to the front end
 */
export interface PollResponse {
  creator: PollResponseUser;
  pollName: string;
  description: string;
  pollId: string;
  options: PollResponseOption[];
  voteLimit: number;
}
export interface PollResponseOption {
  optionId: string;
  value: string;
  votes: PollResponseUser[];
}
export interface PollResponseUser {
  id: string;
  displayName?: string;
  userName: string;
  photos?: Array<{ value: string }>;
}
export interface UpdatePollInput {
  pollName?: string;
  description?: string;
  options?: UpdatePollInputOption[];
}
export interface UpdatePollInputOption {
  optionId: string;
  value: string;
}
export interface VoteInputRequest {
  optionId: string;
}
export interface VoteInput {
  voterId: string;
  optionId: string;
}
export interface User {
  displayName?: string;
  userName: string;
  id: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
}

export interface StoredUser extends User {
  $loki: string;
}
