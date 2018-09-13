import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import PollingApp from "./components/PollingApp";
import store from "./store";
declare let module: any;

ReactDOM.render(
  <Provider store={store}>
    <PollingApp />
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
