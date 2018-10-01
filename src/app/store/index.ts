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
// const persistedState = loadState();

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

// let currentUserState: any;
// store.subscribe(() => {
//   const previousUserState = currentUserState;
//   const currentState = store.getState();
//   currentUserState = currentState.userState;

//   if (previousUserState !== currentUserState) {
//     saveState({
//       userState: currentUserState,
//       userFormState: currentState.userFormState
//     });
//   }
// });

export default store;
