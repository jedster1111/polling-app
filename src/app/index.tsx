import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { injectGlobal } from "styled-components";
import PollingApp from "./components/PollingApp";
import store from "./store";
declare let module: any;

// tslint:disable-next-line
injectGlobal`
  body {
    margin: 0;
    padding: 0;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <PollingApp />
    </Router>
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
