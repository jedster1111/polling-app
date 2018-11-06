import { Button, Form, Input } from "antd";
import { ColProps } from "antd/lib/col";
import * as React from "react";
import { PollFormInput } from "../../reducers/pollForm";
import "./antd-override.css";
import OptionsInput from "./OptionsInput";

interface CreatePollFormProps {
  values: PollFormInput;
  originalValues: PollFormInput;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  discardPoll: () => void;
  addPollOption: () => void;
  removePollOption: (index: number) => void;
  clearOption: (index: number) => void;
  edit?: boolean;
  isLoading: boolean;
}

const itemLayout: { labelCol: ColProps; wrapperCol: ColProps } = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

const PollForm: React.SFC<CreatePollFormProps> = props => {
  const numberOfOptions = props.values.options.reduce((previousVal, option) => {
    if (option.value !== "") {
      previousVal++;
    }
    return previousVal;
  }, 0);

  return (
    <Form onSubmit={props.handleSubmit} id="createPollForm" layout="vertical">
      <Form.Item
        {...itemLayout}
        label="Poll name"
        help={
          props.edit && props.values.pollName !== props.originalValues.pollName
            ? props.values.pollName
              ? `"${props.originalValues.pollName}" will be changed to "${
                  props.values.pollName
                }"`
              : `You can't have an empty poll name, changes will be ignored`
            : undefined
        }
      >
        <Input
          value={props.values.pollName}
          onChange={props.handleChange}
          id="pollName"
          placeholder={
            props.edit ? `${props.originalValues.pollName}` : "Poll name"
          }
        />
      </Form.Item>
      <Form.Item
        label="Description"
        {...itemLayout}
        help={
          props.edit &&
          props.values.description !== props.originalValues.description
            ? props.values.description
              ? `"${props.originalValues.description}" will be changed to "${
                  props.values.description
                }"`
              : `You can't have an empty description, changes will be ignored`
            : undefined
        }
      >
        <Input
          value={props.values.description}
          onChange={props.handleChange}
          id="description"
          placeholder={
            props.edit ? `${props.originalValues.description}` : "Description"
          }
        />
      </Form.Item>
      <OptionsInput
        addPollOption={props.addPollOption}
        removePollOption={props.removePollOption}
        handleChange={props.handleChange}
        values={props.values.options}
        originalValues={props.originalValues.options}
        edit={props.edit}
        clearOption={props.clearOption}
      />
      <Form.Item label="Vote Limit" {...itemLayout}>
        <Input
          value={props.values.voteLimit}
          onChange={props.handleChange}
          min={numberOfOptions ? 1 : 0}
          // max={numberOfOptions}
          type="number"
          id="voteLimit"
          placeholder="Vote Limit"
        />
      </Form.Item>
      <Form.Item wrapperCol={{ xs: { span: 16 }, sm: { span: 16, offset: 4 } }}>
        <Button
          id="createButton"
          type="primary"
          htmlType="submit"
          loading={props.isLoading}
          block
        >
          Submit
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ xs: { span: 16 }, sm: { span: 16, offset: 4 } }}>
        <Button
          id="discardButton"
          type="danger"
          block
          onClick={props.discardPoll}
        >
          Discard
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PollForm;
