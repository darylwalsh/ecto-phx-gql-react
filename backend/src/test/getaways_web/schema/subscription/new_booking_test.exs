defmodule GetawaysWeb.Schema.Subscription.NewBookingTest do
  use GetawaysWeb.SubscriptionCase, async: true

  @mutation """
  mutation ($placeId: ID!, $startDate: Date!, $endDate: Date!) {
    createBooking(placeId: $placeId, startDate: $startDate, endDate: $endDate) {
      startDate
      endDate
    }
  }
  """
  test "new booking can be subscribed to", %{socket: socket} do
    user = user_fixture()
    place = place_fixture()

    subscription = """
      subscription {
        bookingChange(placeId: #{place.id}) {
          startDate
          endDate
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
    booking = %{
      "startDate" => "2018-12-01",
      "endDate" => "2018-12-05",
      "placeId" => place.id,
    }

    conn = build_conn() |> auth_user(user)

    conn = post conn, "/api",
      query: @mutation,
      variables: booking

    expected = %{
      "data" => %{
       "createBooking" => %{
          "startDate" => booking["startDate"],
          "endDate" => booking["endDate"]
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
            "startDate" => booking["startDate"],
            "endDate" => booking["endDate"]
          }
        }
      },
      subscriptionId: subscription_id
    }
    assert_push "subscription:data", push
    assert expected == push
  end
end
