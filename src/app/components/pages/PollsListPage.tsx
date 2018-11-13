import { Alert } from "antd";
import * as React from "react";
import PollsList from "../polls-list/PollsListContainer";

interface PollsListPageInterface {
  hasClosedWarning: boolean;
  onClosedWarning: () => void;
}

const PollsListPage = ({
  hasClosedWarning,
  onClosedWarning
}: PollsListPageInterface) => (
  <div>
    {!hasClosedWarning && (
      <Alert
        message="The server shuts down after 30 minutes of inactivity. Any polls that you have created will be lost!"
        type="warning"
        closable={true}
        onClose={onClosedWarning}
      />
    )}
    <PollsList />
  </div>
);

export default PollsListPage;
