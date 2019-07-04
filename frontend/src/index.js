import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// GraphQL-specific
import { ApolloProvider } from "react-apollo";
import client from "./client";

import "./assets/main.scss";

// ApolloProvider wraps the React app and places the Apollo client
// on the React context so the client can be conveniently accessed
// from anywhere in the component tree.

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
