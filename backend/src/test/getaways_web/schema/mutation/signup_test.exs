defmodule GetawaysWeb.Schema.Mutation.SignupTest do
  use GetawaysWeb.ConnCase, async: true

  @query """
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      user {
        username
      }
    }
  }
  """
  test "signing up" do
    input = %{
      username: "test",
      email: "test@example.com",
      password: "secret"
    }

    conn = post(build_conn(), "/api", %{
      query: @query,
      variables: input
    })

    assert %{"data" => %{
      "signup" => session
    }} = json_response(conn, 200)

    assert %{"user" => %{"username" => "test"}} == session
  end
end
