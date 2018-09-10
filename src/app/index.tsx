import * as React from "react";
import * as ReactDOM from "react-dom";
import PollingApp from "./polling-app";
declare let module: any;

ReactDOM.render(<PollingApp />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
