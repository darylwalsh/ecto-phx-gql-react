# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :cors_plug,
  origin: ["*"],
  max_age: 86400,
  methods: ["GET", "POST"]

config :reactolatry,
  ecto_repos: [Reactolatry.Repo],
  adapter: Ecto.Adapters.Postgres,
  pool_size: 10

# Configures the endpoint
config :reactolatry, ReactolatryWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "r/KECNh6PcQMEwqy78veF/hGvvy+MAiOa9fL2tbURvl4D4K3FZiF4p8zwesH9+dW",
  render_errors: [view: ReactolatryWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: Reactolatry.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  level: :info,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
