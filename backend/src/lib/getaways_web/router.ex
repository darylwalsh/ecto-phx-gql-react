defmodule GetawaysWeb.Router do
  use GetawaysWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug GetawaysWeb.Plugs.SetCurrentUser
  end

  scope "/" do
    pipe_through :api

    forward "/api", Absinthe.Plug,
      schema: GetawaysWeb.Schema.Schema

    forward "/graphiql", Absinthe.Plug.GraphiQL,
      schema: GetawaysWeb.Schema.Schema,
      socket: GetawaysWeb.UserSocket,
      interface: :simple
    end
end
