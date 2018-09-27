import { PollInput, StoredUser } from "./types";

export const inputPollData: PollInput[] = [
  {
    creatorId: "1",
    description: "description1",
    options: ["option1", "option2"],
    pollName: "pollName1"
  },
  {
    creatorId: "2",
    description: "description2",
    options: ["option1", "option2"],
    pollName: "pollName2"
  }
];

export const inputUserData: StoredUser[] = [
  {
    id: "1",
    displayName: "displayName1"
  },
  {
    id: "2",
    displayName: "displayName2"
  }
];
