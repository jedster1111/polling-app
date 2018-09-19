import * as React from "react";
import { connect } from "react-redux";
import {
  changeUserFormData,
  discardUserFormData,
  saveUserFormData
} from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import UserDataForm from "./UserDataForm";

interface UserDataFormContainerProps {
  values: {
    name: string;
  };
  confirmedValues: {
    name: string;
  };
  changeInput: (fieldId: string, value: string) => any;
  saveUserData: (values: { name: string }) => any;
  discardChanges: (confirmedValues: { [key: string]: string }) => any;
}

const mapStateToProps = (state: InitialState) => {
  return {
    values: {
      name: state.userFormState.data.name
    },
    confirmedValues: {
      name: state.userState.data.name
    }
  };
};
const mapDispatchToProps = {
  changeInput: changeUserFormData,
  saveUserData: saveUserFormData,
  discardChanges: discardUserFormData
};

class UserDataFormContainer extends React.Component<
  UserDataFormContainerProps
> {
  handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.saveUserData(this.props.values);
  };
  handleDiscardChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.discardChanges(this.props.confirmedValues);
  };
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeInput(e.target.id, e.target.value);
  };
  render() {
    return (
      <UserDataForm
        discardChanges={this.handleDiscardChanges}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmitForm}
        values={this.props.values}
      />
    );
  }
}

const ConnectedUserDataForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDataFormContainer);

export default ConnectedUserDataForm;
