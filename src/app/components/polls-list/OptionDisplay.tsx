import styled from "styled-components";

const OptionDisplay = styled.button<{}>`
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  min-height: 50px;
  padding: 4px 5px;
  margin: 4px 8px;
  padding: 8px 2px;
  background-color: #edfff7;
  border: solid 1px #636363;
  &:hover {
    background-color: #defcee;
  }
`;

export default OptionDisplay;
