import React from 'react';
import Routes from "./routes";
import ReduxStore from "./store";
import { Provider } from "react-redux";

const App = () => {
    return (
      <Provider store={ReduxStore()}>
          <Routes />
      </Provider>
    )
}

export default App;
