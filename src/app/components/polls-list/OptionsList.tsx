import * as React from "react";
import styled from "styled-components";
import { Option } from "../../../../server/models/database";
import OptionDisplay from "./OptionDisplay";

interface OptionsListProps {
  options: Option[];
}

const OptionsContainer = styled.div<{}>`
  flex: 2 1 200px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  /* border: solid black 1px; */
  padding: 8px 5px;
`;

const OptionsList = (props: OptionsListProps) => {
  return (
    <OptionsContainer>
      {props.options.map(option => (
        <OptionDisplay key={option.optionId}>{option.value}</OptionDisplay>
      ))}
    </OptionsContainer>
  );
};

export default OptionsList;
