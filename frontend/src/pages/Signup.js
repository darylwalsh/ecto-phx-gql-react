import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { GET_CURRENT_USER_QUERY } from "../components/CurrentUser";

const SIGNUP_MUTATION = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: ""
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  isFormValid = event => {
    return (
      this.state.username.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0
    );
  };

  handleCompleted = data => {
    localStorage.setItem("auth-token", data.signup.token);

    this.props.history.push("/");
  };

  handleUpdate = (cache, { data }) => {
    cache.writeQuery({
      query: GET_CURRENT_USER_QUERY,
      data: { me: data.signup.user }
    });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        onCompleted={this.handleCompleted}
        update={this.handleUpdate}>
        {(signup, { loading, error }) => {
          if (loading) return <Loading />;
          return (
            <form
              className="signup"
              onSubmit={e => {
                e.preventDefault();
                signup();
              }}>
              <h2>Sign Up</h2>
              <h3>
                <Link to="/sign-in">Have an account?</Link>
              </h3>
              <Error error={error} />
              <fieldset>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  autoFocus
                  value={this.state.username}
                  onChange={this.handleChange}
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={this.state.email}
                  onChange={this.handleChange}
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={this.state.password}
                  onChange={this.handleChange}
                />
                <button type="submit" disabled={!this.isFormValid()}>
                  Sign Up
                </button>
              </fieldset>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
