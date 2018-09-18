import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import path = require("path");
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../reducers/rootReducer";
import { mainSaga } from "../sagas/sagas";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  connectRouter(history)(rootReducer),
  composeWithDevTools(
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  )
);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept(path.resolve("../reducers"), () => {
    const nextRootReducer = require("../reducers/rootReducer");
    store.replaceReducer(nextRootReducer);
  });
}

sagaMiddleware.run(mainSaga);

export default store;
