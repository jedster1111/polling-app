import * as react from "react";
import { User } from "../../types";

interface LoginFormContainerProps {
  userData: User;
  handleLogin: () => void;
  handleLogout: () => void;
}

const mapDispatchToProps = {
  login,
  logout
};


