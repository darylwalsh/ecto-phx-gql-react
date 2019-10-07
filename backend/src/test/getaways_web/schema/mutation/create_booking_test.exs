defmodule GetawaysWeb.Schema.Mutation.CreateBookingTest do
  use GetawaysWeb.ConnCase, async: true

  @query """
  mutation ($placeId: ID!, $startDate: Date!, $endDate: Date!) {
    createBooking(placeId: $placeId, startDate: $startDate, endDate: $endDate) {
      startDate
      endDate
    }
  }
  """
  test "createBooking mutation creates a booking" do
    place = place_fixture()
    user = user_fixture()

    input = %{
      "startDate" => "2018-12-01",
      "endDate" => "2018-12-05",
      "placeId" => place.id,
    }

    conn = build_conn() |> auth_user(user)

    conn = post conn, "/api",
      query: @query,
      variables: input

    assert %{
      "data" => %{
       "createBooking" => %{
          "startDate" => "2018-12-01",
          "endDate" => "2018-12-05"
        }
      }
    } == json_response(conn, 200)
  end

  test "createBooking mutation fails if variables are invalid" do
    place = place_fixture()
    user = user_fixture()

    input = %{
      "startDate" => nil,
      "endDate" => "2018-12-05",
      "placeId" => place.id,
    }

    conn = build_conn() |> auth_user(user)

    conn = post conn, "/api",
      query: @query,
      variables: input

    assert %{
      "errors" => [
        %{
          "message" => "Argument \"startDate\" has invalid value $startDate.", "locations" => [%{"column" => 0, "line" => 2}]
        }, 
        %{
          "message" => "Variable \"startDate\": Expected non-null, found null.",
          "locations" => [%{"column" => 0, "line" => 1}]
        }
      ]} == json_response(conn, 200)
  end

  test "createBooking mutation fails if not signed in" do
    place = place_fixture()

    input = %{
      "startDate" => "2018-12-01",
      "endDate" => "2018-12-05",
      "placeId" => place.id,
    }

    conn = post(build_conn(), "/api", %{
      query: @query,
      variables: input
    })

    assert %{
      "errors" => [
        %{
          "locations" => [%{"column" => 0, "line" => 2}],
          "message" => "Please sign in first!",
          "path" => ["createBooking"]
        }
      ],
      "data" => %{"createBooking" => nil}
    } == json_response(conn, 200)
  end
end
