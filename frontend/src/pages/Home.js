import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "../components/Error";
import Loading from "../components/Loading";
import PlaceList from "../components/PlaceList";

const GET_PLACES_QUERY = gql`
  query GetPlaces {
    places {
      id
      slug
      name
      location
      description
      pricePerNight
      imageThumbnail
      maxGuests
    }
  }
`;

const Home = () => (
  <Query query={GET_PLACES_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <Error error={error} />;
      return <PlaceList places={data.places} />;
    }}
  </Query>
);

export default Home;
