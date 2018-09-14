import * as React from "react";
import styled from "styled-components";
import Button from "./Button";

interface ButtonsProps {
  discardPoll: () => void;
}

const ButtonsContainer = styled.div<{}>`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  border: 1px black solid;
  border-radius: 5px;
  padding: 5px 2px;
  margin: 10px auto;
  max-width: 350px;
`;

const Buttons = (props: ButtonsProps) => (
  <ButtonsContainer>
    <Button id="createButton" create>
      Create
    </Button>
    <Button
      id="discardButton"
      type="button"
      discard
      onClick={props.discardPoll}
    >
      Discard
    </Button>
  </ButtonsContainer>
);

export default Buttons;
