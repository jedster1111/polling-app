import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import path from "path";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../reducers/rootReducer";
import { mainSaga } from "../sagas/sagas";

const ENV = process.env.NODE_ENV || "development";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
// const persistedState = loadState();

const middleware = () => {
  if (ENV === "development") {
    return composeWithDevTools(
      applyMiddleware(sagaMiddleware, routerMiddleware(history))
    );
  } else {
    return applyMiddleware(sagaMiddleware, routerMiddleware(history));
  }
};

const store = createStore(connectRouter(history)(rootReducer), middleware());

if (ENV === "development") {
  console.log("setting up HMR");
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(path.resolve("../reducers"), () => {
      const nextRootReducer = require("../reducers/rootReducer");
      store.replaceReducer(nextRootReducer);
    });
  }
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
