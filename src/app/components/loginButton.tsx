import * as React from "react";
import styled from "styled-components";

interface StyledButtonProps {
  login?: boolean;
  logout?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  background: ${props =>
    props.login ? "green" : props.logout ? "red" : "grey"};
`;

export const LoginButton = () => (
  <StyledButton type="button" login>
    Login
  </StyledButton>
);
export const LogoutButton = () => (
  <StyledButton type="button" logout>
    Logout
  </StyledButton>
);
