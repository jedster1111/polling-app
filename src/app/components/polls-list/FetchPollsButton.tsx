import { Button, Icon } from "antd";
import * as React from "react";

interface FetchPollsButtonProps {
  fetchPolls: () => void;
  isLoading: boolean;
}

// const StyledButton = styled.button<{}>`
//   transition: background-color 0.15s;
//   border: none;
//   outline: none;
//   border: 1px solid black;
//   max-width: 175px;
//   height: 35px;
//   align-self: flex-end;
//   &:hover {
//     background-color: lightcoral;
//   }
// `;

const FetchPollsButton: React.SFC<FetchPollsButtonProps> = ({
  fetchPolls,
  isLoading
}) => (
  // <StyledButton onClick={props.fetchPolls} id="fetchPollsButton">
  //   Refresh Polls
  // </StyledButton>
  <Button style={{ marginLeft: "auto" }} onClick={fetchPolls}>
    Refresh Polls
    <Icon type="reload" spin={isLoading} />
  </Button>
);

export default FetchPollsButton;
