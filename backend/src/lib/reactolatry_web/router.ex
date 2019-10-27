defmodule ReactolatryWeb.Router do
  use ReactolatryWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug ReactolatryWeb.Plugs.SetCurrentUser
  end

  scope "/" do
    pipe_through :api

    forward "/api", Absinthe.Plug,
      schema: ReactolatryWeb.Schema.Schema

    forward "/graphiql", Absinthe.Plug.GraphiQL,
      schema: ReactolatryWeb.Schema.Schema,
      socket: ReactolatryWeb.UserSocket,
      interface: :playground
    end
end
