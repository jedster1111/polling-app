import * as React from "react";
import LoginForm, { LoginFormProps } from "../login-form/LoginForm";

type HomePageProps = LoginFormProps;

const HomePage = ({
  isLoggedIn,
  userData,
  handleLogin,
  handleLogout
}: HomePageProps) => (
  <LoginForm
    isLoggedIn={isLoggedIn}
    userData={userData}
    handleLogin={handleLogin}
    handleLogout={handleLogout}
  />
);

export default HomePage;
