import * as React from "react";
import { connect } from "react-redux";
import {
  changeNamespaceForm,
  discardNamespaceForm,
  navigateToNamespace,
  updateNamespace
} from "../../actions/actions";
import { NameSpaceFormState } from "../../reducers/namespaceReducer";
import { StoreState } from "../../reducers/rootReducer";
// import styled from "styled-components";

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

const NamespaceDisplay: React.SFC<NamespaceDisplayProps> = props => (
  <div>
    <p>You are in /{props.namespace || "public"}</p>
    <input
      id="namespace"
      value={props.values.namespace}
      onChange={event =>
        props.changeNamespaceForm("namespace", event.target.value)
      }
    />
    <div>
      <button onClick={event => props.discardNamespaceForm()}>Discard</button>
      <button
        onClick={event => props.navigateToNamespace(props.values.namespace)}
      >
        Submit
      </button>
    </div>
  </div>
);

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
  mapStateToProps,
  mapDispatchToProps
)(NamespaceDisplay);
