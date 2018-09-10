import * as React from "react";
import { Provider } from "react-redux";
import { Hello } from "./Hello";
import store from "../store";

class PollingApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Hello compiler="Typescript" framework="React" bundler="Webpack" />
        </div>
      </Provider>
    );
  }
}

export default PollingApp;
