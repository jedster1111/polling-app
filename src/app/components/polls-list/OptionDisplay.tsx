import styled from "styled-components";

const OptionDisplay = styled.div<{}>`
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 250px;
  min-width: 140px;
  margin: 4px 8px;
  padding: 8px 2px;
  background-color: #edfff7;
  border: solid 1px #636363;
`;

export default OptionDisplay;
