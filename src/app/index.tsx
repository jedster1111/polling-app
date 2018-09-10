import * as React from "react";
import * as ReactDOM from "react-dom";
import PollingApp from "./components/polling-app";
declare let module: any;

ReactDOM.render(<PollingApp />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
