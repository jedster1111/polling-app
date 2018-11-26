import { Button, Form, Icon, Input, Modal, Card } from "antd";
import * as React from "react";
import { FormOptionFields } from "../../actions/actions";
import { PollFormInputOption } from "../../reducers/pollForm";

interface OptionsInputProps {
  values: PollFormInputOption[];
  originalValues: PollFormInputOption[];
  handleChange: (
    optionIndex: number,
    field: FormOptionFields,
    value: string
  ) => void;
  addPollOption: () => void;
  removePollOption: (index: number) => void;
  clearOption: (index: number) => void;
  setEditingAdvancedOption: (index: number | undefined) => void;
  editingAdvancedOptionIndex: number | undefined;
  edit?: boolean;
}

const OptionsInput = (props: OptionsInputProps) => {
  return (
    <React.Fragment>
      {props.values.map((option, index) => {
        const originalOption = props.originalValues.find(
          origOpt =>
            origOpt.optionId !== "" && origOpt.optionId === option.optionId
        );
        return (
          <Form.Item
            key={index}
            help={
              originalOption &&
              option.value !== originalOption.value &&
              option.optionId &&
              props.edit
                ? option.value === ""
                  ? `"${originalOption.value}" will be deleted`
                  : `"${originalOption.value}" will be changed to "${
                      option.value
                    }"`
                : undefined
            }
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
              placeholder={
                originalOption && option.optionId
                  ? `${originalOption.value}`
                  : "New option"
              }
              onChange={event =>
                props.handleChange(index, "value", event.target.value)
              }
              suffix={
                !(option.optionId && !option.value) && (
                  <span>
                    <Button
                      className="editAdvanced"
                      icon="setting"
                      shape="circle"
                      size="small"
                      onClick={() => props.setEditingAdvancedOption(index)}
                    />
                    <Button
                      className="removeOption"
                      icon="minus"
                      shape="circle"
                      size="small"
                      onClick={() =>
                        !option.optionId
                          ? props.removePollOption(index)
                          : props.clearOption(index)
                      }
                    />
                  </span>
                )
              }
            />
            <Modal
              visible={props.editingAdvancedOptionIndex === index}
              onOk={() => props.setEditingAdvancedOption(undefined)}
              onCancel={() => props.setEditingAdvancedOption(undefined)}
              footer={null}
              width="75%"
              style={{ maxWidth: "800px" }}
            >
              <Card style={{ margin: "15px 14px" }}>
                <Form.Item
                  label="Link"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    value={option.link}
                    onChange={e =>
                      props.handleChange(index, "link", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Image Url"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    value={option.imageUrl}
                    onChange={e =>
                      props.handleChange(index, "imageUrl", e.target.value)
                    }
                  />
                </Form.Item>
              </Card>
            </Modal>
          </Form.Item>
        );
      })}
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
