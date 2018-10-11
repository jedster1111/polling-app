import { Button, Icon } from "antd";
import * as React from "react";

interface FetchPollsButtonProps {
  fetchPolls: () => void;
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

const FetchPollsButton = (props: FetchPollsButtonProps) => (
  // <StyledButton onClick={props.fetchPolls} id="fetchPollsButton">
  //   Refresh Polls
  // </StyledButton>
  <Button style={{ marginLeft: "auto" }}>
    Refresh Polls
    <Icon type="reload" />
  </Button>
);

export default FetchPollsButton;
