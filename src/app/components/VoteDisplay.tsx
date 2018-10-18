import * as React from "react";
import { Poll, User } from "../types";

interface VoteDisplayProps {
  poll: Poll;
  user: User;
}

const VoteDisplay: React.SFC<VoteDisplayProps> = props => (
  <p>
    Votes:{" "}
    {
      props.poll.options.filter(option =>
        option.votes.find(vote => vote.id === props.user.id)
      ).length
    }{" "}
    / {props.poll.voteLimit}
  </p>
);

export default VoteDisplay;
