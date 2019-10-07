import React, { Component } from "react";
import { withRouter } from "react-router";
import { withApollo } from "react-apollo";

class Signout extends Component {
  handleClick = () => {
    localStorage.removeItem("auth-token");

    this.props.client.resetStore();

    this.props.history.push("/");
  };

  render() {
    return (
      <button className="signout" onClick={this.handleClick}>
        Sign Out
      </button>
    );
  }
}

export default withRouter(withApollo(Signout));
