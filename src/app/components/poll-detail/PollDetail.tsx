import * as React from "react";
import { Poll } from "../../types";

export interface PollDetailProps {
  pollData: Poll | undefined;
  isLoading: boolean;
}

const PollDetail: React.SFC<PollDetailProps> = ({ pollData, isLoading }) => (
  <p>{pollData ? pollData.pollId : "Poll doesn't exist"}</p>
);

export default PollDetail;
