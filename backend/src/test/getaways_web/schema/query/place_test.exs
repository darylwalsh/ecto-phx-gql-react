defmodule GetawaysWeb.Schema.Query.PlaceTest do
  use GetawaysWeb.ConnCase, async: true

  @query """
  query ($slug: String!) {
    place(slug: $slug) {
      name
    }
  }
  """
  @variables %{"slug" => "place-1"}
  test "place query returns the place with a given slug" do
    places_fixture()

    conn = build_conn()
    conn = get conn, "/api", query: @query, variables: @variables
    
    assert %{
      "data" => %{
        "place" =>
          %{"name" => "Place 1"}
      }
    } == json_response(conn, 200)
  end

end
