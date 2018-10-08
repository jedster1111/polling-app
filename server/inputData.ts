import { PollInput, User } from "./types";

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
  },
  {
    creatorId: "25291974",
    description: "description3",
    options: ["option1", "option2"],
    pollName: "pollName3"
  }
];

export const inputUserData: User[] = [
  {
    id: "1",
    displayName: "displayName1"
  },
  {
    id: "2",
    displayName: "displayName2"
  },
  {
    id: "25291974",
    displayName: "Jed"
  }
];
