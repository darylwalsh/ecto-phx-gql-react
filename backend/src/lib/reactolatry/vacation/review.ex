defmodule Reactolatry.Vacation.Review do
  use Ecto.Schema
  import Ecto.Changeset

  schema "reviews" do
    field :rating, :integer
    field :comment, :string

    belongs_to :place, Reactolatry.Vacation.Place
    belongs_to :user, Reactolatry.Accounts.User

    timestamps(type: :utc_datetime)
  end

  def changeset(review, attrs) do
    required_fields = [:rating, :comment, :place_id]

    review
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:place)
    |> assoc_constraint(:user)
  end
end
