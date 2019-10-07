defmodule GetawaysWeb.Schema.Mutation.CreateReviewTest do
  use GetawaysWeb.ConnCase, async: true

  @query """
  mutation ($placeId: ID!, $comment: String!, $rating: Int!) {
    createReview(placeId: $placeId, comment: $comment, rating: $rating) {
      comment
      rating
    }
  }
  """
  test "createReview mutation creates a review" do
    place = place_fixture()
    user = user_fixture()

    input = %{
      "comment" => "❤️",
      "rating" => 5,
      "placeId" => place.id,
    }

    conn = build_conn() |> auth_user(user)
    
    conn = post conn, "/api",
      query: @query,
      variables: input

    assert %{
      "data" => %{
       "createReview" => %{
          "comment" => "❤️",
          "rating" => 5
        }
      }
    } == json_response(conn, 200)
  end

  test "createReview mutation fails if variables are invalid" do
    place = place_fixture()
    user = user_fixture()

    input = %{
      "comment" => nil,
      "rating" => 5,
      "placeId" => place.id,
    }

    conn = build_conn() |> auth_user(user)

    conn = post(conn, "/api", %{
      query: @query,
      variables: input
    })

    assert %{
      "errors" => [
        %{
          "locations" => [%{"column" => 0, "line" => 1}],
          "message" => "Variable \"comment\": Expected non-null, found null."
          }
      ]
    } == json_response(conn, 200)
  end

  test "createReview mutation fails if not signed in" do
    place = place_fixture()

    input = %{
      "comment" => "❤️",
      "rating" => 5,
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
          "path" => ["createReview"]
        }
      ],
      "data" => %{"createReview" => nil}
    } == json_response(conn, 200)
  end

end
