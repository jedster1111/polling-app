import * as React from "react";
// import { Link } from "react-router-dom";
import styled from "styled-components";

interface ViewResultsButtonProps {
  value: string;
  toggleShowResults: (pollId: string) => any;
  pollId: string;
}

// const StyledLink = styled(Link)<{}>`
//   display: flex;
//   text-decoration: none;
//   min-width: 140px;
// `;

export const StyledButton = styled.button<{}>`
  display: block;
  transition: background-color 0.15s;
  border: 1px solid black;
  outline: none;
  text-decoration: none;
  margin: 5px 5px;
  padding: 10px 0;
  width: 110px;
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
