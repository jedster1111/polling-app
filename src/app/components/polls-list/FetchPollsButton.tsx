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
  <Button
    onClick={fetchPolls}
    style={{ marginBottom: "5px" }}
    className="fetchPollsButton"
  >
    Refresh Polls
    <Icon type="reload" spin={isLoading} />
  </Button>
);

export default FetchPollsButton;
