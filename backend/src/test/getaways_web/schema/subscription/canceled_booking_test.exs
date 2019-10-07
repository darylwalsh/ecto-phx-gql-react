defmodule GetawaysWeb.Schema.Subscription.CanceledBookingTest do
  use GetawaysWeb.SubscriptionCase, async: true

  @mutation """
  mutation ($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      id
    }
  }
  """
  test "canceled booking can be subscribed to", %{socket: socket} do
    user = user_fixture()
    place = place_fixture()
    booking = booking_fixture(user, %{place_id: place.id})

    subscription = """
      subscription bookingChange {
        bookingChange(placeId: #{place.id}) {
          id
        }
      }
    """

    #
    # 1. Setup the subscription
    #
    ref = push_doc socket, subscription
    assert_reply ref, :ok, %{subscriptionId: subscription_id}

    #
    # 2. Run a mutation to trigger the subscription
    #
    input = %{
      "bookingId" => booking.id
    }

    conn = build_conn() |> auth_user(user)

    conn = post conn, "/api",
      query: @mutation,
      variables: input

    expected = %{
      "data" => %{
       "cancelBooking" => %{
          "id" => Integer.to_string(booking.id)
        }
      }
    }

    assert expected == json_response(conn, 200)

    #
    # 3. Assert that the expected subscription data was pushed to us
    #
    expected = %{
      result: %{
        data: %{
          "bookingChange" => %{
            "id" => Integer.to_string(booking.id)
          }
        }
      },
      subscriptionId: subscription_id
    }
    assert_push "subscription:data", push
    assert expected == push
  end
end
