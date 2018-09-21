import * as React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavBarContainer = styled.ul<{}>`
  list-style-type: none;
  width: 150px;
  margin: 0 8px;
  margin-bottom: 3px;
  padding: 0;
  background-color: white;
  padding: 3px 2px;
  box-sizing: border-box;
`;

const StyledList = styled.li<{}>`
  margin: 3px 2px;
`;

const StyledLink = styled(NavLink)`
  color: black;
  transition: all 0.3s;
  text-align: right;
  text-decoration: none;
  display: block;
  margin: 2px 3px;
  padding: 5px 7px;
  height: 30px;
  background-color: #efefef;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    padding-right: 10px;
    border-bottom: solid grey 1px;
    background-color: #e8e8e8;
  }
  &.active {
    background-color: #e2e2e2;
  }
`;
const NavBar = () => (
  <NavBarContainer>
    <StyledList>
      <StyledLink to="/" exact id="homeLink">
        Home
      </StyledLink>
    </StyledList>
    <StyledList>
      <StyledLink to="/create-poll" exact id="createPollLink">
        Create a New Poll
      </StyledLink>
    </StyledList>
    <StyledList>
      <StyledLink to="/list-polls" exact id="pollsListLink">
        Polls
      </StyledLink>
    </StyledList>
  </NavBarContainer>
);

export default NavBar;
