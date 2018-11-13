import { Icon } from "antd";
import * as React from "react";
import styled from "styled-components";

interface IsOpenDisplayProps {
  isOpen: boolean;
}

const IsOpenDisplayContainer = styled.p<{
  isOpen: boolean;
}>`
  color: ${({ isOpen }) => (isOpen ? "inherit" : "red")};
`;

const IsOpenDisplay: React.SFC<IsOpenDisplayProps> = ({ isOpen }) => (
  <IsOpenDisplayContainer isOpen={isOpen} id="vote-display-is-open">
    Poll is {isOpen ? "open" : "closed"}
    <Icon type={isOpen ? "unlock" : "lock"} style={{ marginLeft: "5px" }} />
  </IsOpenDisplayContainer>
);

export default IsOpenDisplay;
