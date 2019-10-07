defmodule GetawaysWeb.Schema.Mutation.SigninTest do
  use GetawaysWeb.ConnCase, async: true

  @query """
  mutation ($username: String!, $password: String!) {
    signin(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
  """
  test "signing in" do
    user_attrs = %{
      username: "test",
      email: "test@example.com",
      password: "secret"
    }

    assert {:ok, user} = Getaways.Accounts.create_user(user_attrs)

    input = %{
      "username" => user_attrs[:username],
      "password" => user_attrs[:password]
    }

    conn = post(build_conn(), "/api", %{
      query: @query,
      variables: input
    })

    assert %{"data" => %{
      "signin" => session
    }} = json_response(conn, 200)

    assert %{
      "token" => token,
      "user"  => user_data
    } = session

    assert %{"username" => user.username} == user_data
    assert {:ok, %{id: user.id}} ==
      GetawaysWeb.AuthToken.verify(token)
  end
end
