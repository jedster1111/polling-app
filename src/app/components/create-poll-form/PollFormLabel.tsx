import * as React from "react";
import styled from "styled-components";

interface PollFormLabelProps {
  labelText: string;
}

const PollFormLabel = styled.label<{}>`
  text-align: left;
  font-size: 18px;
  margin-top: 3px;
  margin-right: 3px;
  width: 100px;
`;

const StyledPollFormLabel = (props: PollFormLabelProps) => (
  <PollFormLabel>{props.labelText}:</PollFormLabel>
);

export default StyledPollFormLabel;
