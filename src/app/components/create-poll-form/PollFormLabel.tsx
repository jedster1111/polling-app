import * as React from "react";
import styled from "styled-components";

interface PollFormLabelProps {
  labelText: string;
}

const PollFormLabel = styled.label<{}>`
  font-size: 18px;
  margin-right: 3px;
`;

const StyledPollFormLabel = (props: PollFormLabelProps) => (
  <PollFormLabel>{props.labelText}:</PollFormLabel>
);

export default StyledPollFormLabel;
