defmodule Getaways.TestHelpers do
  alias Getaways.Repo

  alias Getaways.Vacation.{Place, Booking, Review}
  alias Getaways.Accounts.User

  def user(username) do
    Getaways.Repo.get_by!(User, username: username)
  end

  def place(name) do
    Getaways.Repo.get_by!(Place, name: name)
  end

  def user_fixture(attrs \\ %{}) do
    username = "user-#{System.unique_integer([:positive])}"

    attrs = 
      Enum.into(attrs, %{
        username: "test-user",
        email: attrs[:email] || "#{username}@example.com",
        password: attrs[:password] || "supersecret"
      })

    {:ok, user} =
      %User{}
      |> User.changeset(attrs)
      |> Repo.insert()

    user
  end

  def place_fixture(attrs \\ %{}) do
    name = "place-#{System.unique_integer([:positive])}"

    attrs = 
      Enum.into(attrs, %{
        name: attrs[:name] || name,
        slug: attrs[:slug] || name,
        description: "some description",
        location: "some location",
        price_per_night: Decimal.from_float(120.5),
        image: "some-image",
        image_thumbnail: "some-image-thumbnail"
      })

    {:ok, place} =
      %Place{}
      |> Place.changeset(attrs)
      |> Repo.insert()

    place
  end

  def booking_fixture(%User{} = user, attrs \\ %{}) do
    attrs =
      Enum.into(attrs, %{
        start_date: ~D[2019-04-01],
        end_date: ~D[2019-04-05]
      })

    {:ok, booking} = 
      %Booking{}
      |> Booking.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:user, user)
      |> Repo.insert()

    booking
  end

  def review_fixture(%User{} = user, attrs \\ %{}) do
    attrs = 
      Enum.into(attrs, %{
        comment: "some comment",
        rating: 5,
      })

    {:ok, review} =     
      %Review{}
      |> Review.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:user, user)
      |> Repo.insert()

    review
  end

  def places_fixture() do
    place1 = 
      %Place{
        name: "Place 1",
        slug: "place-1",
        location: "location-1",
        description: "description-1",
        pet_friendly: false,
        pool: false,
        wifi: true,
        max_guests: 1,
        price_per_night: Decimal.from_float(100.00),
        image: "https://i.imgur.com/LZnJJ9s.jpg",
        image_thumbnail: "https://i.imgur.com/LZnJJ9s.jpg"
        } |> Repo.insert!

    place2 = 
      %Place{
        name: "Place 2",
        slug: "place-2",
        location: "location-2",
        description: "description-2",
        pet_friendly: true,
        pool: true,
        wifi: false,
        max_guests: 2,
        price_per_night: Decimal.from_float(200.00),
        image: "https://i.imgur.com/LZnJJ9s.jpg",
        image_thumbnail: "https://i.imgur.com/LZnJJ9s.jpg"
        } |> Repo.insert!

    place3 = 
      %Place{
        name: "Place 3",
        slug: "place-3",
        location: "location-3",
        description: "description-3",
        pet_friendly: true,
        pool: false,
        wifi: true,
        max_guests: 3,
        price_per_night: Decimal.from_float(300.00),
        image: "https://i.imgur.com/LZnJJ9s.jpg",
        image_thumbnail: "https://i.imgur.com/LZnJJ9s.jpg"
        } |> Repo.insert!

    [place1, place2, place3]
  end

end
