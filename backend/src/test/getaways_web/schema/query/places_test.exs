defmodule GetawaysWeb.Schema.Query.PlacesTest do
  use GetawaysWeb.ConnCase, async: true

  @query """
  {
    places {
      name
    }
  }
  """
  test "places query returns all places" do
    places_fixture()

    conn = build_conn()
    conn = get conn, "/api", query: @query

    assert %{"data" => %{
      "places" => [
        %{"name" => "Place 1"},
        %{"name" => "Place 2"},
        %{"name" => "Place 3"}
      ]
      }
    } = json_response(conn, 200)
  end

  @query """
  query ($limit: Int!) {
    places(limit: $limit) {
      name
    }
  }
  """
  @variables %{"limit" => 2}
  test "places query returns limited number of places" do
    places_fixture()

    response = get(build_conn(), "/api", query: @query, variables: @variables)

    assert %{
      "data" => %{
        "places" => [
          %{"name" => "Place 1"},
          %{"name" => "Place 2"}
        ]
      }
    } = json_response(response, 200)
  end

  @query """
  query ($filter: PlaceFilter!) {
    places(filter: $filter) {
      name
    }
  }
  """
  @variables %{"filter" => %{"matching" => "location-1"}}
  test "places query returns places filtered by name" do
    places_fixture()

    response = get(build_conn(), "/api", query: @query, variables: @variables)
    
    assert %{
      "data" => %{
        "places" => [
          %{"name" => "Place 1"},
        ]
      }
    } == json_response(response, 200)
  end

  @query """
  query ($filter: PlaceFilter!) {
    places(filter: $filter) {
      name
    }
  }
  """
  @variables %{"filter" => %{"matching" => 123}}
  test "places query returns an error when using a bad variable value" do
    places_fixture()

    response = get(build_conn(), "/api", query: @query, variables: @variables)
    
    assert %{"errors" => _} = json_response(response, 200)
  end


  @query """
  query ($filter: PlaceFilter!) {
    places(filter: $filter) {
      name
    }
  }
  """
  @variables %{"filter" => %{
    "pet_friendly" => true, "pool" => true, "wifi" => false
  }}
  test "places query returns places filtered by pet friendly, pool, wifi" do
    places_fixture()

    response = get(build_conn(), "/api", query: @query, variables: @variables)
    
    assert %{
      "data" => %{
        "places" => [
          %{"name" => "Place 2"}
        ]
      }
    } == json_response(response, 200)
  end

  @query """
  query ($filter: PlaceFilter!) {
    places(filter: $filter) {
      name
    }
  }
  """
  @variables %{"filter" => %{ "guest_count" => 2 }}
  test "places query returns places filtered by guest count" do
    places_fixture()

    response = get(build_conn(), "/api", query: @query, variables: @variables)
    
    assert %{
      "data" => %{
        "places" => [
          %{"name" => "Place 2"},
          %{"name" => "Place 3"}
        ]
      }
    } == json_response(response, 200)
  end

  @query """
  query ($filter: PlaceFilter!) {
    places(filter: $filter) {
      name
    }
  }
  """
  @variables %{"filter" => %{
    "available_between" => %{
      start_date: "2019-01-05",
      end_date: "2019-01-10"
    }
  }}
  test "places query returns places filtered by available dates" do
    places_fixture()
    place = place("Place 1")
    user = user_fixture()

    Getaways.Vacation.create_booking(user, %{
      place_id: place.id,
      start_date: ~D[2019-01-05],
      end_date: ~D[2019-01-10]
    })

    response = get(build_conn(), "/api", query: @query, variables: @variables)
    
    assert %{
      "data" => %{
        "places" => [
          %{"name" => "Place 2"},
          %{"name" => "Place 3"}
        ]
      }
    } == json_response(response, 200)
  end

  @query """
  query ($order: SortOrder!) {
    places(order: $order) {
      name
    }
  }
  """
  @variables %{"order" => "DESC"}
  test "places query returns places descending" do
    places_fixture()

    response = get(build_conn(), "/api", query: @query, variables: @variables)

    assert %{
      "data" => %{
        "places" => [%{"name" => "Place 3"} | _]
      }
    } = json_response(response, 200)
  end

  @variables %{"order" => "ASC"}
  test "places query returns places ascending" do
    places_fixture()

    response = get(build_conn(), "/api", query: @query, variables: @variables)
    
    assert %{
      "data" => %{
        "places" => [%{"name" => "Place 1"} | _]
      }
    } = json_response(response, 200)
  end

end
