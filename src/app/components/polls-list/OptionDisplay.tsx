import styled from "styled-components";

const OptionDisplay = styled.button<{ voted: boolean }>`
  box-sizing: border-box;
  transition: outline 0.5s;
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
  max-height: 100px;
  padding: 6px 5px;
  margin: 4px 8px;
  padding: 8px 2px;
  background-color: #f7d488;
  outline: ${props =>
    props.voted ? "solid 2px #636363" : "solid 2px transparent"};
  &:hover {
    background-color: #f9a03f;
  }
`;

export default OptionDisplay;
