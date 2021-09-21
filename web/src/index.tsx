import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import store, {persistedStore} from "./redux/store";
import "./i18n/configs";
// import "./utils/mock";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistedStore}>
      <App/>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
