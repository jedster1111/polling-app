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
          labelCol={{ span: 4 }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16, offset: index === 0 ? 0 : 4 }
          }}
        >
          <Input
            id={`optionInput${index + 1}`}
            className="optionInput"
            value={option.value}
            placeholder={option.optionId ? "existing option" : "new option"}
            onChange={props.handleChange}
            suffix={
              !option.optionId && (
                <Button
                  className="removeOption"
                  icon="minus"
                  shape="circle"
                  size="small"
                  onClick={() => props.removePollOption(index)}
                />
              )
            }
          />
        </Form.Item>
      ))}
      <Form.Item wrapperCol={{ xs: { span: 16 }, sm: { span: 16, offset: 4 } }}>
        <Button
          type="dashed"
          onClick={props.addPollOption}
          block
          id="addOption"
        >
          <Icon type="plus" />
          Add Option
        </Button>
      </Form.Item>
    </React.Fragment>
  );
};

export default OptionsInput;
