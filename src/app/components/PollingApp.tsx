import * as React from "react";
import { Hello } from "./HelloWorld";

class PollingApp extends React.Component {
  render() {
    return <Hello compiler="Typescript" framework="React" bundler="Webpack" />;
  }
}

export default PollingApp;
