import { Button, Form, Input, Modal } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import UrlSafeString from "url-safe-string";
import {
  changeNamespaceForm,
  discardNamespaceForm,
  navigateToNamespace,
  showNamespaceForm,
  updateNamespace
} from "../../actions/actions";
import { NameSpaceFormState } from "../../reducers/namespaceReducer";
import { StoreState } from "../../reducers/rootReducer";

const { generate: makeStringUrlSafe } = UrlSafeString();

interface StateProps {
  values: NameSpaceFormState;
  namespace: string;
  isEditing: boolean;
}

interface OwnProps {}

interface DispatchProps {
  showNamespaceForm: typeof showNamespaceForm;
  changeNamespaceForm: typeof changeNamespaceForm; // Not sure if typeof is strictly correct here
  updateNamespace: typeof updateNamespace;
  discardNamespaceForm: typeof discardNamespaceForm;
  navigateToNamespace: typeof navigateToNamespace;
}

type NamespaceDisplayProps = StateProps & OwnProps & DispatchProps;

const mapStateToProps = (state: StoreState): StateProps => ({
  values: state.namespaceState.formData,
  namespace: state.router.location.pathname.slice(1).split("/")[0],
  isEditing: state.namespaceState.isEditing
});

const mapDispatchToProps: DispatchProps = {
  showNamespaceForm,
  changeNamespaceForm,
  discardNamespaceForm,
  updateNamespace,
  navigateToNamespace
};

const NamespaceDisplayContainer = styled.li`
  float: right;
`;

const ButtonContainer = styled.div``;

class NamespaceDisplay extends React.Component<NamespaceDisplayProps> {
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      this.props.namespace !== makeStringUrlSafe(this.props.values.namespace)
    ) {
      this.props.navigateToNamespace(this.props.values.namespace);
      this.props.updateNamespace(this.props.values.namespace);
    }
  };

  handleDiscard = () => {
    this.props.discardNamespaceForm(this.props.namespace || "public");
  };

  componentDidMount() {
    this.props.changeNamespaceForm(
      "namespace",
      this.props.namespace || "public"
    );
  }

  componentDidUpdate(prevProps: NamespaceDisplayProps) {
    if (this.props.namespace !== prevProps.namespace) {
      this.props.changeNamespaceForm("namespace", this.props.namespace);
    }
  }

  render() {
    return (
      <NamespaceDisplayContainer>
        <div>
          <span className="namespace-value">
            /{this.props.namespace || "public"}
          </span>{" "}
          <Button
            icon="edit"
            onClick={() => this.props.showNamespaceForm("show")}
            size="small"
            className="edit-namespace-button"
          />
        </div>
        <Modal
          visible={this.props.isEditing}
          onCancel={this.handleDiscard}
          footer={null}
          style={{
            width: "70%"
          }}
          destroyOnClose
        >
          <Form
            onSubmit={this.handleSubmit}
            layout="inline"
            style={{ padding: "8px 4px", margin: "15px 20px" }}
          >
            <Form.Item>
              <Input
                id="namespace"
                value={this.props.values.namespace}
                onChange={event =>
                  this.props.changeNamespaceForm(
                    "namespace",
                    event.target.value
                  )
                }
                className="edit-namespace-input"
                autoFocus
              />
            </Form.Item>
            <Form.Item>
              <ButtonContainer>
                <Button
                  htmlType="button"
                  onClick={this.handleDiscard}
                  style={{ margin: "2px 5px" }}
                >
                  Discard
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: "2px 5px" }}
                >
                  Submit
                </Button>
              </ButtonContainer>
            </Form.Item>
          </Form>
        </Modal>
      </NamespaceDisplayContainer>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
  mapStateToProps,
  mapDispatchToProps
)(NamespaceDisplay);
