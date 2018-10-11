import { Button, Form, Icon, Input } from "antd";
import * as React from "react";

interface OptionsInputProps {
  values: Array<{ optionId: string; value: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addPollOption: () => void;
  removePollOption: (index: number) => void;
  edit?: boolean;
}

const OptionsInput = (props: OptionsInputProps) => {
  return (
    <React.Fragment>
      {props.values.map((option, index) => (
        // <SingleOptionInputContainer key={index}>
        //   <StyledOptionTextInput
        //     id={`optionInput${index + 1}`}
        //     placeholder={option.optionId ? "existing option" : "new option"}
        //     value={option.value}
        //     handleChange={props.handleChange}
        //   />
        //   {!option.optionId && (
        //     <OptionButton
        //       remove
        //       onClick={() => props.removePollOption(index)}
        //     />
        //   )}
        // </SingleOptionInputContainer>
        <Form.Item
          key={index}
          label={index === 0 ? "Options" : ""}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 19, offset: index === 0 ? 0 : 3 }}
        >
          <Input
            id={`optionInput${index + 1}`}
            value={option.value}
            placeholder={option.optionId ? "existing option" : "new option"}
            onChange={props.handleChange}
            style={{ width: "90%", marginRight: 8 }}
          />
          {!option.optionId && (
            <Button
              key={index}
              icon="minus-circle"
              shape="circle"
              type="dashed"
              onClick={() => props.removePollOption(index)}
            />
          )}
        </Form.Item>
      ))}
      <Form.Item wrapperCol={{ span: 19, offset: 3 }}>
        <Button
          type="dashed"
          onClick={props.addPollOption}
          style={{ width: "90%" }}
        >
          <Icon type="plus" />
          Add Option
        </Button>
      </Form.Item>
    </React.Fragment>
  );
};

export default OptionsInput;
