import { Avatar, Icon, Menu } from "antd";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { User } from "../../types";
import NamespaceDisplay from "../polls-list/NamespaceDisplay";
import {
  GithubLoginButton,
  GoogleLoginButton,
  LogoutButton
} from "./AuthButtons";

interface NavBarProps {
  location: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  userData: User;
  layout: "horizontal" | "inline";
  handleGithubLogin: () => void;
  handleGoogleLogin: () => void;
  handleLogout: () => void;
}

const NavBar: React.SFC<NavBarProps> = ({
  location,
  isLoggedIn,
  isLoading,
  userData,
  handleGithubLogin,
  handleGoogleLogin,
  handleLogout,
  layout
}) => {
  const [namespace, page] = location.slice(1).split("/");

  return (
    <>
      <Menu
        mode={layout}
        defaultSelectedKeys={[""]}
        selectedKeys={[page || "/"]}
        className="navbar"
      >
        <Menu.Item key="/">
          <NavLink to={`/${namespace || "public"}`} id="pollsListLink">
            Polls
          </NavLink>
        </Menu.Item>
        <Menu.Item disabled={!isLoggedIn} key="create-poll">
          <NavLink
            to={`/${namespace || "public"}/create-poll`}
            id="createPollLink"
          >
            Create a Poll
          </NavLink>
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
        {isLoggedIn ? (
          <Menu.Item>
            <LogoutButton handleClick={handleLogout} />
          </Menu.Item>
        ) : (
          <Menu.SubMenu
            title={
              <span>
                Login
                <Icon type="login" style={{ marginLeft: "6px" }} />
              </span>
            }
          >
            <Menu.Item>
              <GithubLoginButton handleClick={handleGithubLogin} />
            </Menu.Item>
            <Menu.Item>
              <GoogleLoginButton handleClick={handleGoogleLogin} />
            </Menu.Item>
          </Menu.SubMenu>
        )}
        <NamespaceDisplay />
      </Menu>
    </>
  );
};

export default NavBar;
