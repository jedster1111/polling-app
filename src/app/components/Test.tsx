import * as React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightgreen;
  width: 250px;
  height: 50px;
  font-size: 19px;
  border-radius: 15px;
`;

const Test = () => <Wrapper>Testing styled components</Wrapper>;

export default Test;
