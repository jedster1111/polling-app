import * as React from "react";
import { connect } from "react-redux";
import uuid = require("uuid/v1");
import { addArticle } from "../actions/actions";

interface Article {
  title: string;
  id: string;
}
interface FormProps {
  addArticle: (data: Article) => void;
}
interface FormState {
  [key: string]: string;
}
interface FormChangeEvent {
  target: {
    id: string;
    value: string;
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addArticle: (article: Article) => dispatch(addArticle(article))
  };
};
class ExampleForm extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      title: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event: FormChangeEvent) {
    this.setState({ [event.target.id]: event.target.value });
  }
  handleSubmit(event: any) {
    event.preventDefault();
    const { title } = this.state;
    const id = uuid();
    this.props.addArticle({ title, id });
    this.setState({ title: "" });
  }
  render() {
    const { title } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">SAVE</button>
      </form>
    );
  }
}

const ConnectedForm = connect(
  null,
  mapDispatchToProps
)(ExampleForm);

export default ConnectedForm;
