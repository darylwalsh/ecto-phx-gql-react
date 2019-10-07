import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "../components/Error";
import Loading from "../components/Loading";
import PlaceDetails from "../components/PlaceDetails";
import PlaceBookings from "../components/PlaceBookings";
import PlaceReviews from "../components/PlaceReviews";

const GET_PLACE_QUERY = gql`
  query GetPlace($slug: String!) {
    place(slug: $slug) {
      id
      slug
      name
      location
      image
      description
      pricePerNight
      maxGuests
      wifi
      pool
      petFriendly
      bookings {
        id
        startDate
        endDate
        totalPrice
      }
      reviews {
        id
        comment
        rating
        insertedAt
        user {
          username
        }
      }
    }
  }
`;

class Place extends Component {
  render() {
    const { slug } = this.props.match.params;

    return (
      <Query
        query={GET_PLACE_QUERY}
        variables={{ slug: slug }}
        fetchPolicy="network-only">
        {({ data, loading, error, subscribeToMore }) => {
          if (loading) return <Loading />;
          if (error) return <Error error={error} />;

          return (
            <div className="place">
              <PlaceDetails place={data.place} />
              <PlaceBookings
                place={data.place}
                subscribeToBookingChanges={subscribeToMore}
              />
              <PlaceReviews place={data.place} />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Place;
export { GET_PLACE_QUERY };
