import styled from "styled-components";

const OptionDisplay = styled.button<{ voted: boolean }>`
  transition: border 0.5s;
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
  background-color: #77ffd1;
  border: ${props =>
    props.voted ? "solid 2px #636363" : "solid 1px transparent"};
  &:hover {
    background-color: #8cffd8;
  }
`;

export default OptionDisplay;
