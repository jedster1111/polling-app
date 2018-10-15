import { Button, Icon } from "antd";
import * as React from "react";

interface FetchPollsButtonProps {
  fetchPolls: () => void;
  isLoading: boolean;
}

const FetchPollsButton: React.SFC<FetchPollsButtonProps> = ({
  fetchPolls,
  isLoading
}) => (
  <Button style={{ marginLeft: "auto" }} onClick={fetchPolls}>
    Refresh Polls
    <Icon type="reload" spin={isLoading} />
  </Button>
);

export default FetchPollsButton;
