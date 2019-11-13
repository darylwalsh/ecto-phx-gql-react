defmodule Reactolatry.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    import Supervisor.Spec

    # List all child processes to be supervised
    children = [
      Reactolatry.Repo,
      ReactolatryWeb.Endpoint,
      supervisor(Absinthe.Subscription, [ReactolatryWeb.Endpoint])
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Reactolatry.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def start_phase(:migrate, _, _) do
    Ecto.Migrator.with_repo(Reactolatry.Repo, &Ecto.Migrator.run(&1, :up, all: true))
    :ok
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ReactolatryWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
