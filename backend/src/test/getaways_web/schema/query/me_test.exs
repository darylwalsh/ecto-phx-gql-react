defmodule GetawaysWeb.Schema.Query.MeTest do
  use GetawaysWeb.ConnCase, async: true

  @query """
  {
    me {
      username
      bookings {
        startDate
        endDate
      }
    }
  }
  """
  test "me query returns my bookings" do
    place = place_fixture()
    user = user_fixture()

    booking_attrs = %{
      start_date: ~D[2019-04-01],
      end_date: ~D[2019-04-05],
      place_id: place.id
    }

    assert {:ok, booking} = 
      Getaways.Vacation.create_booking(user, booking_attrs)

    conn = build_conn() |> auth_user(user)

    conn = get conn, "/api", query: @query
    assert %{
      "data" => %{
        "me" => %{ 
          "username" => user_name,
          "bookings" => [
              %{
                "startDate" => "2019-04-01",
                "endDate" => "2019-04-05"
              }
            ]
        }
      }
    } = json_response(conn, 200)

    assert user.username == user_name
  end

  test "me query fails if not signed in" do
    conn = build_conn()

    conn = get conn, "/api", query: @query

    assert %{
      "data" => %{
        "me" => nil
      }
    } == json_response(conn, 200)
  end
end
