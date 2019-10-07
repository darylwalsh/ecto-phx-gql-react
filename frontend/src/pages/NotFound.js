import React from "react";

const NotFound = ({ location }) => (
  <h3 className="text-center">
    Sorry, no matching page for <code>{location.pathname}</code>
  </h3>
);

export default NotFound;
