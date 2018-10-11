import { Avatar, Menu } from "antd";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { User } from "../../types";
import { LoginButton, LogoutButton } from "../login-form/AuthButtons";

interface NavBarProps {
  isLoggedIn: boolean;
  userData: User;
  handleLogin: () => void;
  handleLogout: () => void;
}

const NavBar: React.SFC<NavBarProps> = ({
  isLoggedIn,
  userData,
  handleLogin,
  handleLogout
}) => (
  <Menu mode="horizontal">
    <Menu.Item>
      <NavLink to="/" id="pollsListLink" key="pollsListLink">
        Polls
      </NavLink>
    </Menu.Item>
    <Menu.Item disabled={!isLoggedIn}>
      <NavLink to="/create-poll" id="createPollLink" key="createPollLink">
        Create a Poll
      </NavLink>
    </Menu.Item>
    <Menu.Item>
      {isLoggedIn ? (
        <LogoutButton handleLogout={handleLogout} />
      ) : (
        <LoginButton handleLogin={handleLogin} />
      )}
    </Menu.Item>
    {isLoggedIn && (
      <Menu.Item>
        <Avatar
          src={userData.photos && userData.photos[0].value}
          alt={userData.userName}
        />
      </Menu.Item>
    )}
  </Menu>
);

export default NavBar;
