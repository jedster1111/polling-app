import * as React from "react";
import { connect } from "react-redux";
import { changeUserFormData, saveUserFormData } from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import UserDataForm from "./UserDataForm";

interface UserDataFormContainerProps {
  values: {
    name: string;
  };
  changeInput: (fieldId: string, value: string) => any;
  saveUserData: (values: { name: string }) => any;
}

const mapStateToProps = (state: InitialState) => {
  return {
    values: {
      name: state.userFormState.name
    }
  };
};
const mapDispatchToProps = {
  changeInput: changeUserFormData,
  saveUserData: saveUserFormData
};

class UserDataFormContainer extends React.Component<
  UserDataFormContainerProps
> {
  handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(this.props.values);
    this.props.saveUserData(this.props.values);
  };
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id, e.target.value);
    this.props.changeInput(e.target.id, e.target.value);
  };
  render() {
    return (
      <UserDataForm
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
