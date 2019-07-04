import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "../components/Error";
import Loading from "../components/Loading";
import Booking from "../components/Booking";
import RequireSignIn from "../components/RequireSignIn";

const GET_MY_BOOKINGS_QUERY = gql`
  query GetMyBookings {
    me {
      bookings {
        id
        startDate
        endDate
        totalPrice
        state
        place {
          id
          name
          slug
          imageThumbnail
          pricePerNight
        }
      }
    }
  }
`;

const MyBookings = () => (
  <RequireSignIn>
    <Query query={GET_MY_BOOKINGS_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;

        return (
          <div className="bookings">
            <h1>My Bookings</h1>
            {data.me.bookings.map(booking => (
              <Booking key={booking.id} booking={booking} />
            ))}
          </div>
        );
      }}
    </Query>
  </RequireSignIn>
);

export default MyBookings;
export { GET_MY_BOOKINGS_QUERY };
