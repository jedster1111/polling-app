import { Button, Form, Input } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import UrlSafeString from "url-safe-string";
import {
  changeNamespaceForm,
  discardNamespaceForm,
  navigateToNamespace,
  updateNamespace
} from "../../actions/actions";
import { NameSpaceFormState } from "../../reducers/namespaceReducer";
import { StoreState } from "../../reducers/rootReducer";

const { generate: makeStringUrlSafe } = UrlSafeString();

interface StateProps {
  values: NameSpaceFormState;
  namespace: string;
}

interface OwnProps {}

interface DispatchProps {
  changeNamespaceForm: typeof changeNamespaceForm; // Not sure if typeof is strictly correct here
  updateNamespace: typeof updateNamespace;
  discardNamespaceForm: typeof discardNamespaceForm;
  navigateToNamespace: typeof navigateToNamespace;
}

type NamespaceDisplayProps = StateProps & OwnProps & DispatchProps;

const mapStateToProps = (state: StoreState): StateProps => ({
  values: state.namespaceState.formData,
  namespace: state.router.location.pathname.slice(1).split("/")[0]
});

const mapDispatchToProps: DispatchProps = {
  changeNamespaceForm,
  discardNamespaceForm,
  updateNamespace,
  navigateToNamespace
};

const NamespaceDisplayContainer = styled.div`
  margin-top: 8px;
`;

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
        <p>You are in /{this.props.namespace || "public"}</p>
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Form.Item>
            <Input
              id="namespace"
              value={this.props.values.namespace}
              onChange={event =>
                this.props.changeNamespaceForm("namespace", event.target.value)
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="button"
              onClick={() =>
                this.props.discardNamespaceForm(
                  this.props.namespace || "public"
                )
              }
            >
              Discard
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </NamespaceDisplayContainer>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
  mapStateToProps,
  mapDispatchToProps
)(NamespaceDisplay);
