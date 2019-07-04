use Mix.Config

config :pbkdf2_elixir, :rounds, 1

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :getaways, GetawaysWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :getaways, Getaways.Repo,
  username: "postgres",
  password: "postgres",
  database: "getaways_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
