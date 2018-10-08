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
  /* border: solid 1px black; */
  padding: 5px 7px;
`;
const TextContainer = styled.div`
  text-align: center;
`;
const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-content: center;
  border: solid 1px black;
  /* background-color: lightskyblue; */
  margin: 6px 2px;
  margin-bottom: 3px;
  padding: 3px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const UserDataDisplay = (props: UserDataDisplayProps) => (
  <UserDataDisplayContainer>
    {/* <TextContainer>Id: {props.userData.id}</TextContainer> */}
    <TextContainer>{props.userData.displayName}</TextContainer>
  </UserDataDisplayContainer>
);

const LoginForm = (props: LoginFormProps) => {
  return (
    <LoginFormContainer>
      {props.isLoggedIn && <UserDataDisplay userData={props.userData} />}
      <ButtonContainer>
        {props.isLoggedIn ? (
          <LogoutButton handleLogout={props.handleLogout} />
        ) : (
          <LoginButton handleLogin={props.handleLogin} />
        )}
      </ButtonContainer>
    </LoginFormContainer>
  );
};

export default LoginForm;
