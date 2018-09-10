import * as React from "react";
import Form from "./ExampleForm";
import List from "./List";
interface IProps {
  compiler: string;
  framework: string;
  bundler: string;
}
export class Hello extends React.Component<IProps, {}> {
  render() {
    return (
      <div>
        <h1>
          This is a {this.props.framework} application using{" "}
          {this.props.compiler} with {this.props.bundler} test did this change?
        </h1>
        <h3>Articles:</h3>
        <List />
        <Form />
      </div>
    );
  }
}
