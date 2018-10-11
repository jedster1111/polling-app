import { Button, Form, Input } from "antd";
import * as React from "react";
import { PollFormInput } from "../../reducers/rootReducer";
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

// export const FormContainer = styled(
//   posed.form({
//     enter: { opacity: 1, y: 0, delayChildren: 150, staggerChildren: 150 },
//     exit: { opacity: 0, y: 30 }
//   })
// )`
//   flex: 1;
//   min-width: 240px;
//   max-width: 750px;
//   border: black solid 1px;
//   margin: 0 auto;
//   margin-bottom: 10px;
//   padding: 0px 5px;
//   border-radius: 8px;
//   background-color: #c6dea6;
// `;

const itemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

const PollForm: React.SFC<CreatePollFormProps> = props => {
  return (
    // <FormContainer onSubmit={props.handleSubmit} id="createPollForm">
    //   <SingleInput
    //     id="pollName"
    //     value={props.values.pollName}
    //     labelText="Poll Name"
    //     handleChange={props.handleChange}
    //     placeholder="Enter the poll name"
    //   />
    //   <SingleInput
    //     id="description"
    //     value={props.values.description}
    //     labelText="Description"
    //     handleChange={props.handleChange}
    //     placeholder="Enter the description"
    //   />
    //   <OptionsInput
    //     handleChange={props.handleChange}
    //     values={props.values.options}
    //     addPollOption={props.addPollOption}
    //     removePollOption={props.removePollOption}
    //     edit={props.edit}
    //   />
    //   <Buttons edit={props.edit} discardPoll={props.discardPoll} />
    // </FormContainer>
    <Form onSubmit={props.handleSubmit} id="createPollForm" layout="vertical">
      <Form.Item {...itemLayout} label="Poll Name">
        <Input
          value={props.values.pollName}
          onChange={props.handleChange}
          id="pollName"
          placeholder="poll name"
        />
      </Form.Item>
      <Form.Item label="Description" {...itemLayout}>
        <Input
          value={props.values.description}
          onChange={props.handleChange}
          id="description"
          placeholder="description"
        />
      </Form.Item>
      <OptionsInput
        addPollOption={props.addPollOption}
        removePollOption={props.removePollOption}
        handleChange={props.handleChange}
        values={props.values.options}
      />
      <Form.Item wrapperCol={{ xs: { span: 16 }, sm: { span: 16, offset: 4 } }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={props.isLoading}
          block
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PollForm;
