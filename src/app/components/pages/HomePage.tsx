import * as React from "react";
import styled from "styled-components";

const HomePageContainer = styled.div<{}>`
  flex: 1;
  max-width: 800px;
  border: 1px solid black;
`;

const HomePage = () => (
  <HomePageContainer>Welcome to my home page!</HomePageContainer>
);

export default HomePage;
