use Mix.Config

config :pbkdf2_elixir, :rounds, 1

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :reactolatry, ReactolatryWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :reactolatry, Reactolatry.Repo,
  username: System.get_env("DB_USER") || "postgres",
  password: System.get_env("DB_PASS") || "postgres",
  database: "reactolatry_test",
  hostname: System.get_env("DB_HOST") || "db",
  pool: Ecto.Adapters.SQL.Sandbox
