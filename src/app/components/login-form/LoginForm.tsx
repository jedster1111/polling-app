import * as React from "react";
import styled from "styled-components";
import { User } from "../../types";
import { LoginButton, LogoutButton } from "./AuthButtons";

export interface LoginFormProps {
  isLoggedIn: boolean;
  userData: User;
  handleLogin: () => void;
  handleLogout: () => void;
}
interface UserDataDisplayProps {
  userData: User;
}

const UserDataDisplayContainer = styled.div`
  border: solid 1px black;
  padding: 5px 7px;
`;
const TextContainer = styled.div``;
const LoginFormContainer = styled.div`
  border: solid 1px black;
  background-color: lightskyblue;
  padding: 5px 7px;
`;

const UserDataDisplay = (props: UserDataDisplayProps) => (
  <UserDataDisplayContainer>
    <TextContainer>Id: {props.userData.id}</TextContainer>
    <TextContainer>Name: {props.userData.displayName}</TextContainer>
  </UserDataDisplayContainer>
);

const LoginForm = (props: LoginFormProps) => {
  return (
    <LoginFormContainer>
      {props.isLoggedIn && <UserDataDisplay userData={props.userData} />}
      {props.isLoggedIn ? (
        <LogoutButton handleLogout={props.handleLogout} />
      ) : (
        <LoginButton handleLogin={props.handleLogin} />
      )}
    </LoginFormContainer>
  );
};

export default LoginForm;
