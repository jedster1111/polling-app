import { Button, Icon } from "antd";
import * as React from "react";

type ButtonTypes = "Login" | "Logout" | "Loading";

interface NavBarButtonProps {
  handleClick?: () => void;
  type: ButtonTypes;
}

const NavBarButton: React.SFC<NavBarButtonProps> = ({ handleClick, type }) => {
  const icon =
    type === "Login" ? (
      <Icon type="github" />
    ) : type === "Loading" ? (
      <Icon type="loading" />
    ) : (
      undefined
    );
  return (
    <Button
      onClick={handleClick}
      className={
        type === "Login"
          ? "loginButton"
          : type === "Logout"
          ? "logoutButton"
          : type === "Loading"
          ? "loggedInLoading"
          : undefined
      }
    >
      {type}
      {icon}
    </Button>
  );
};

export default NavBarButton;
