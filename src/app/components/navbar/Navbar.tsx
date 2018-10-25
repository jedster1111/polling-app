import { Avatar, Menu } from "antd";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { User } from "../../types";
import NavBarButton from "./AuthButtons";

interface NavBarProps {
  location: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  userData: User;
  handleLogin: () => void;
  handleLogout: () => void;
  navigateToPollForm: () => void;
}

const NavBar: React.SFC<NavBarProps> = ({
  location,
  isLoggedIn,
  isLoading,
  userData,
  handleLogin,
  handleLogout,
  navigateToPollForm
}) => (
  <Menu mode="horizontal" defaultSelectedKeys={["/"]} selectedKeys={[location]}>
    <Menu.Item key="/">
      <NavLink to="/" id="pollsListLink">
        Polls
      </NavLink>
    </Menu.Item>
    <Menu.Item disabled={!isLoggedIn} key="/create-poll">
      <div onClick={navigateToPollForm} id="createPollLink">
        Create a Poll
      </div>
    </Menu.Item>
    <Menu.Item>
      {isLoading ? (
        <NavBarButton type="Loading" />
      ) : isLoggedIn ? (
        <NavBarButton type="Logout" handleClick={handleLogout} />
      ) : (
        <NavBarButton type="Login" handleClick={handleLogin} />
      )}
    </Menu.Item>
    {isLoggedIn && (
      <Menu.Item>
        <a href={userData.profileUrl} target="_blank">
          <Avatar
            src={userData.photos && userData.photos[0].value}
            alt={userData.userName}
          />
        </a>
      </Menu.Item>
    )}
  </Menu>
);

export default NavBar;
