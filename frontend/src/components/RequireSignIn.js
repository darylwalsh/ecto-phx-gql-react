import React from "react";
import SigninForm from "../components/SigninForm";
import CurrentUser from "../components/CurrentUser";

const RequireSignIn = props => (
  <CurrentUser>
    {currentUser => {
      if (!currentUser) {
        return (
          <>
            <p className="warning">Please sign in first...</p>
            <SigninForm />
          </>
        );
      }
      return props.children;
    }}
  </CurrentUser>
);

export default RequireSignIn;
