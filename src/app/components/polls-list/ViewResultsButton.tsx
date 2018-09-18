import * as React from "react";
// import { Link } from "react-router-dom";
import styled from "styled-components";

interface ViewResultsButtonProps {
  value: string;
  to: string;
  toggleShowResults: (pollId: string) => any;
  pollId: string;
}

// const StyledLink = styled(Link)<{}>`
//   display: flex;
//   text-decoration: none;
//   min-width: 140px;
// `;

const StyledButton = styled.button<{}>`
  display: block;
  transition: background-color 0.15s;
  border: 1px solid black;
  outline: none;
  text-decoration: none;
  margin: 5px 5px;
  padding: 10px 0;
  width: 100%;
  &:hover {
    background-color: lightcoral;
  }
`;

const ViewResultsButton = (props: ViewResultsButtonProps) => (
  <StyledButton onClick={() => props.toggleShowResults(props.pollId)}>
    {props.value}
  </StyledButton>
);

export default ViewResultsButton;
