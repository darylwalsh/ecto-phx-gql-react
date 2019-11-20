# ecto-phx-gql-react

Demo site: 
[https://www.reactolatry.io/](https://www.reactolatry.io/)

Graphiql playground: 
[https://api.reactolatry.io/graphiql](https://api.reactolatry.io/graphiql)

Example graphql query:
```
query{
  place(slug: "ski-cabin") {
    id
    name
    location
  }
}
````

Full Stack React with GraphQL via Apollo/Absinthe resolving to a Phoenix/Ecto schema in front of a Postgres db

Deployed via Docker containers on a Kubernetes cluster with Helm charts
