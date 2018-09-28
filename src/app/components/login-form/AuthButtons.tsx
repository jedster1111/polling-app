import * as React from "react";
import styled from "styled-components";

interface StyledButtonProps {
  login?: boolean;
  logout?: boolean;
}
interface LoginButtonProps {
  handleLogin: () => void;
}
interface LogoutButtonProps {
  handleLogout: () => void;
}

const StyledButton = styled.button<StyledButtonProps>`
  border: none;
  border: solid black 1px;
  outline: none;
  background: ${props =>
    props.login ? "green" : props.logout ? "red" : "grey"};
  height: 45px;
  width: 140px;
  margin: 5px;
`;

export const LoginButton = (props: LoginButtonProps) => (
  <StyledButton type="button" onClick={props.handleLogin} login>
    Login
  </StyledButton>
);
export const LogoutButton = (props: LogoutButtonProps) => (
  <StyledButton type="button" onClick={props.handleLogout} logout>
    Logout
  </StyledButton>
);
