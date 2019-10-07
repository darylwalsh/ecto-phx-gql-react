defmodule GetawaysWeb.Resolvers.Vacation do
  alias Getaways.Vacation
  alias GetawaysWeb.Schema.ChangesetErrors

  def places(_, args, _) do
    {:ok, Vacation.list_places(args)}
  end

  def place(_, %{slug: slug}, _) do
    {:ok, Vacation.get_place_by_slug!(slug)}
  end

  def create_booking(_, args, %{context: %{current_user: user}}) do
    case Vacation.create_booking(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Could not create booking", 
          details: ChangesetErrors.error_details(changeset)
        }

      {:ok, booking} ->
        publish_booking_change(booking)
        {:ok, booking}
    end
  end

  def cancel_booking(_, args, %{context: %{current_user: user}}) do
    booking = Vacation.get_booking!(args[:booking_id])

    # Make sure the user owns the booking
    if booking.user_id == user.id do
      case Vacation.cancel_booking(booking) do
        {:error, changeset} ->
          {
            :error,
            message: "Could not cancel booking", 
            details: ChangesetErrors.error_details(changeset)
          }

        {:ok, booking} ->
          publish_booking_change(booking)
          {:ok, booking}
      end
    else
      {
        :error,
        message: "Hey, that's not your booking!"
      }
    end
  end

  def create_review(_, args, %{context: %{current_user: user}}) do
    case Vacation.create_review(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Could not create review", 
          details: ChangesetErrors.error_details(changeset)
        }

      {:ok, review} ->
        {:ok, review}
    end
  end

  defp publish_booking_change(booking) do
    Absinthe.Subscription.publish(
      GetawaysWeb.Endpoint,
      booking,
      booking_change: booking.place_id
    )
  end
end
