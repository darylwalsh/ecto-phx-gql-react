defmodule Getaways.VacationTest do
  use Getaways.DataCase, async: true

  alias Getaways.Vacation
  alias Getaways.Vacation.{Review, Booking}

  describe "get_place_by_slug!/1" do
    test "returns the place with the given slug" do
      place = place_fixture()
      assert Vacation.get_place_by_slug!(place.slug) == place
    end
  end

  describe "list_places/1" do
    test "returns all places by default" do
      places = places_fixture()
      
      results = Vacation.list_places([])

      assert length(results) == length(places)
    end

    test "returns limited number of places" do
      places_fixture()
      
      criteria = %{limit: 1}

      results = Vacation.list_places(criteria)

      assert length(results) == 1
    end

    test "returns limited and ordered places" do
      places_fixture()
      
      args = %{limit: 3, order: :desc}

      results = Vacation.list_places(args)

      assert Enum.map(results, &(&1.name)) == ["Place 3", "Place 2", "Place 1"]
    end

    test "returns places filtered by matching name" do
      places_fixture()
      
      criteria = %{filter: %{matching: "1"}}

      results = Vacation.list_places(criteria)

      assert Enum.map(results, &(&1.name)) == ["Place 1"]
    end

    test "returns places filtered by pet friendly" do
      places_fixture()
      
      criteria = %{filter: %{pet_friendly: true}}

      results = Vacation.list_places(criteria)

      assert Enum.map(results, &(&1.name)) == ["Place 2", "Place 3"]
    end

    test "returns places filtered by pool" do
      places_fixture()
      
      criteria = %{filter: %{pool: true}}

      results = Vacation.list_places(criteria)

      assert Enum.map(results, &(&1.name)) == ["Place 2"]
    end

    test "returns places filtered by wifi" do
      places_fixture()
      
      criteria = %{filter: %{wifi: true}}

      results = Vacation.list_places(criteria)

      assert Enum.map(results, &(&1.name)) == ["Place 1", "Place 3"]
    end

    test "returns places filtered by guest count" do
      places_fixture()
      
      criteria = %{filter: %{guest_count: 3}}

      results = Vacation.list_places(criteria)

      assert Enum.map(results, &(&1.name)) == ["Place 3"]
    end

    test "returns places available between dates" do
      user = user_fixture()
      place = place_fixture()

      booking_fixture(user, %{
        place_id: place.id,
        start_date: ~D[2019-01-05],
        end_date: ~D[2019-01-10]
      })

      # Existing booking period:
      #        01-05    01-10
      # --------[---------]-------
      # Case 1
      # --------[---------]-------
      assert places_available_between(~D[2019-01-05], ~D[2019-01-10]) == []

      # Case 2
      # --------[----]------------
      assert places_available_between(~D[2019-01-05], ~D[2019-01-08]) == []

      # Case 3
      # -------------[----]-------
      assert places_available_between(~D[2019-01-08], ~D[2019-01-10]) == []

      # Case 4
      # [-----]-------------------
      assert places_available_between(~D[2019-01-01], ~D[2019-01-04]) == [place]

      # Case 5
      # --------------------[----]
      assert places_available_between(~D[2019-01-11], ~D[2019-01-12]) == [place]

      # Case 6
      # -----[----]---------------
      assert places_available_between(~D[2019-01-04], ~D[2019-01-05]) == []

      # Case 7
      # -----------[---]----------
      assert places_available_between(~D[2019-01-07], ~D[2019-01-08]) == []

      # Case 8
      # ------[-------]-----------
      assert places_available_between(~D[2019-01-04], ~D[2019-01-08]) == []

      # Case 9
      # --------------[--------]--
      assert places_available_between(~D[2019-01-08], ~D[2019-01-12]) == []

      # Case 10
      # -----[----------------]---     
      assert places_available_between(~D[2019-01-03], ~D[2019-01-12]) == []
    end
  end

  describe "get_booking!/1" do
    test "returns the booking with the given id" do
      user = user_fixture()
      place = place_fixture()
      booking = booking_fixture(user, %{place_id: place.id})

      result = Vacation.get_booking!(booking.id)

      assert booking.id == result.id
      assert booking.user_id == result.user_id
    end
  end

  describe "create_booking/1" do
    @valid_attrs %{
      start_date: ~D[2019-04-01],
      end_date: ~D[2019-04-05]
    }

    test "with valid data creates a booking" do
      user = user_fixture()
      place = place_fixture()

      valid_attrs = Map.put(@valid_attrs, :place_id, place.id)

      assert {:ok, %Booking{} = booking} =
        Vacation.create_booking(user, valid_attrs)

      assert booking.user == user
      assert booking.state == "reserved"
      assert booking.total_price == Decimal.mult(place.price_per_night, 4)
    end

    test "with invalid data returns error changeset" do
      user = user_fixture()
      place = place_fixture()

      valid_attrs = Map.put(@valid_attrs, :place_id, place.id)
      invalid_attrs = %{valid_attrs | start_date: nil}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, invalid_attrs)
    end

    test "with start date after end date returns error changeset" do
      user = user_fixture()
      place = place_fixture()

      valid_attrs = Map.put(@valid_attrs, :place_id, place.id)
      invalid_attrs =
        %{valid_attrs | start_date: ~D[2019-04-10], end_date: ~D[2019-04-01]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, invalid_attrs)
    end

    test "with unavailable dates returns error changeset" do
      user = user_fixture()
      place = place_fixture()

      booking_fixture(user, %{
        place_id: place.id,
        start_date: ~D[2019-01-05],
        end_date: ~D[2019-01-10]
      })

      valid_attrs = Map.put(@valid_attrs, :place_id, place.id)

      # Existing booking period:
      #        01-05    01-10
      # --------[---------]-------
      # Case 1
      # --------[---------]-------
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-05], end_date: ~D[2019-01-10]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)

      # Case 2
      # --------[----]------------
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-05], end_date: ~D[2019-01-08]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)

      # Case 3
      # -------------[----]-------
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-08], end_date: ~D[2019-01-10]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)

      # Case 4
      # [-----]-------------------
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-01], end_date: ~D[2019-01-04]}

      assert {:ok, %Booking{}} =
        Vacation.create_booking(user, attrs)

      # Case 5
      # --------------------[----]
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-11], end_date: ~D[2019-01-12]}

      assert {:ok, %Booking{}} =
        Vacation.create_booking(user, attrs)

      # Case 6
      # -----[----]---------------
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-04], end_date: ~D[2019-01-05]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)

      # Case 7
      # -----------[---]----------
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-07], end_date: ~D[2019-01-08]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)

      # Case 8
      # ------[-------]-----------
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-04], end_date: ~D[2019-01-08]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)

      # Case 9
      # --------------[--------]--
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-08], end_date: ~D[2019-01-12]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)

      # Case 10
      # -----[----------------]---     
      attrs =
        %{valid_attrs | start_date: ~D[2019-01-03], end_date: ~D[2019-01-12]}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_booking(user, attrs)
    end
  end

  describe "cancel_booking/2" do
    test "cancels the booking" do
      user = user_fixture()
      place = place_fixture()
      booking = booking_fixture(user, %{place_id: place.id})

      assert {:ok, %Booking{} = booking} =
        Vacation.cancel_booking(booking)
      assert booking.state == "canceled"
    end
  end

  describe "create_review/1" do
    @valid_attrs %{
      comment: "Thumbs up!",
      rating: 5
    }

    test "with valid data creates a review" do
      user = user_fixture()
      place = place_fixture()

      valid_attrs = Map.put(@valid_attrs, :place_id, place.id)

      assert {:ok, %Review{} = review} =
        Vacation.create_review(user, valid_attrs)

      assert review.user == user
    end

    test "with invalid data returns error changeset" do
      user = user_fixture()
      place = place_fixture()

      valid_attrs = Map.put(@valid_attrs, :place_id, place.id)

      invalid_attrs = %{valid_attrs | comment: nil}

      assert {:error, %Ecto.Changeset{}} =
        Vacation.create_review(user, invalid_attrs)
    end
  end

  defp places_available_between(start_date, end_date) do
    args = [
      {:filter, 
        [
          {
            :available_between, 
            %{start_date: start_date, end_date: end_date}
          }
        ]
      }
    ]

    Vacation.list_places(args)
  end

end
