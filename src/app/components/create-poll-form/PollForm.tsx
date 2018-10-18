import { Button, Form, Input } from "antd";
import { ColProps } from "antd/lib/col";
import * as React from "react";
import { PollFormInput } from "../../reducers/pollForm";
import "./antd-override.css";
import OptionsInput from "./OptionsInput";

interface CreatePollFormProps {
  values: PollFormInput;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  discardPoll: () => void;
  addPollOption: () => void;
  removePollOption: (index: number) => void;
  edit?: boolean;
  isLoading: boolean;
}

const itemLayout: { labelCol: ColProps; wrapperCol: ColProps } = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

const PollForm: React.SFC<CreatePollFormProps> = props => {
  return (
    <Form onSubmit={props.handleSubmit} id="createPollForm" layout="vertical">
      <Form.Item {...itemLayout} label="Poll name">
        <Input
          value={props.values.pollName}
          onChange={props.handleChange}
          id="pollName"
          placeholder="Poll name"
        />
      </Form.Item>
      <Form.Item label="Description" {...itemLayout}>
        <Input
          value={props.values.description}
          onChange={props.handleChange}
          id="description"
          placeholder="Description"
        />
      </Form.Item>
      <OptionsInput
        addPollOption={props.addPollOption}
        removePollOption={props.removePollOption}
        handleChange={props.handleChange}
        values={props.values.options}
      />
      <Form.Item label="Vote Limit" {...itemLayout}>
        <Input
          value={props.values.voteLimit}
          onChange={props.handleChange}
          min={1}
          max={props.values.options.length}
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
