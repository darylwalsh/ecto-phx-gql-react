defmodule GetawaysWeb.Schema.Mutation.CancelBookingTest do
  use GetawaysWeb.ConnCase, async: true

  alias Getaways.Vacation

  @query """
  mutation ($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      state
    }
  }
  """
  test "cancelBooking mutation cancels the booking" do
    place = place_fixture()
    user = user_fixture()

    attrs = %{
      start_date: ~D[2019-04-01],
      end_date: ~D[2019-04-05],
      place_id: place.id
    }

    assert {:ok, booking} = Vacation.create_booking(user, attrs)

    input = %{
      "bookingId" => booking.id,
      "state" => "canceled"
    }

    conn = build_conn() |> auth_user(user)
    
    conn = post conn, "/api",
      query: @query,
      variables: input

    assert %{
      "data" => %{
       "cancelBooking" => %{
          "state" => "canceled"
        }
      }
    } == json_response(conn, 200)
  end

  test "cancelBooking mutation fails if not signed in" do    
    input = %{
      "bookingId" => 1,
      "state" => "canceled"
    }

    conn = post(build_conn(), "/api", %{
      query: @query,
      variables: input
    })

    assert %{
      "data" => %{"cancelBooking" => nil},
      "errors" => [%{
        "locations" => [%{"column" => 0, "line" => 2}],
        "message" => "Please sign in first!",
        "path" => ["cancelBooking"]
      }]
    } == json_response(conn, 200)
  end
end
