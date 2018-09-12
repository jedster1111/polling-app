import * as React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: green;
  width: 250px;
  height: 50px;
  font-size: 25px;
`;

const Test = () => <Wrapper>Wow storybook</Wrapper>;

export default Test;
