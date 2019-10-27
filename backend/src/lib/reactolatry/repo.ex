defmodule Reactolatry.Repo do
  use Ecto.Repo,
    otp_app: :reactolatry,
    adapter: Ecto.Adapters.Postgres
end
