import * as React from "react";
import { connect } from "react-redux";
import {
  changeUserFormData,
  discardUserFormData,
  saveUserFormData,
  toggleChangingName
} from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import UserDataDisplay from "./UserDataDisplay";
import UserDataForm from "./UserDataForm";

interface UserDataFormContainerProps {
  values: {
    name: string;
  };
  confirmedValues: {
    name: string;
  };
  isChangingName: boolean;
  changeInput: (fieldId: string, value: string) => any;
  saveUserData: (values: { name: string }) => any;
  discardChanges: (confirmedValues: { [key: string]: string }) => any;
  toggleChangingName: () => any;
}

const mapStateToProps = (state: InitialState) => {
  return {
    values: {
      name: state.userFormState.data.name
    },
    confirmedValues: {
      name: state.userState.data.name
    },
    isChangingName: state.userFormState.isChangingName
  };
};
const mapDispatchToProps = {
  changeInput: changeUserFormData,
  saveUserData: saveUserFormData,
  discardChanges: discardUserFormData,
  toggleChangingName
};

class UserDataFormContainer extends React.Component<
  UserDataFormContainerProps
> {
  handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.props.values.name) {
      this.props.saveUserData(this.props.values);
    } else {
      this.props.discardChanges(this.props.confirmedValues);
    }
  };
  handleDiscardChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.discardChanges(this.props.confirmedValues);
  };
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeInput(e.target.id, e.target.value);
  };
  handleToggleChangingName = () => {
    this.props.toggleChangingName();
  };
  render() {
    return this.props.isChangingName ? (
      <UserDataForm
        discardChanges={this.handleDiscardChanges}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmitForm}
        values={this.props.values}
      />
    ) : (
      <UserDataDisplay
        confirmedValues={this.props.confirmedValues}
        toggleChangingName={this.handleToggleChangingName}
      />
    );
  }
}

const ConnectedUserDataForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDataFormContainer);

export default ConnectedUserDataForm;
