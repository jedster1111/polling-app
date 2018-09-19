import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import path = require("path");
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../reducers/rootReducer";
import { mainSaga } from "../sagas/sagas";
import { loadState, saveState } from "../sessionStorage";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const persistedState = loadState();

const store = createStore(
  connectRouter(history)(rootReducer),
  persistedState,
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

let currentUserState: any;
store.subscribe(() => {
  const previousUserState = currentUserState;
  currentUserState = store.getState().userState;

  if (previousUserState !== currentUserState) {
    saveState({
      userState: currentUserState
    });
  }
});

export default store;
