import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "../reducers/reducers";
import { watcherSaga } from "../sagas/sagas";

const sagaMiddleware = createSagaMiddleware();
const reduxDevTools =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  reducer,
  compose(
    applyMiddleware(sagaMiddleware),
    reduxDevTools
  )
);

sagaMiddleware.run(watcherSaga);

export default store;
