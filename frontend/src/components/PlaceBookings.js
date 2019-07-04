import React, { Component } from "react";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CreateBooking from "./CreateBooking";
import CurrentUser from "./CurrentUser";
import BookingCalendar from "./custom-inputs/BookingCalendar";

const BOOKING_CHANGE_SUBSCRIPTION = gql`
  subscription BookingChange($placeId: String!) {
    bookingChange(placeId: $placeId) {
      id
      startDate
      endDate
      totalPrice
      state
    }
  }
`;

class PlaceBookings extends Component {
  static propTypes = {
    place: PropTypes.object.isRequired,
    subscribeToBookingChanges: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.subscribeToBookingChanges({
      document: BOOKING_CHANGE_SUBSCRIPTION,
      variables: { placeId: this.props.place.id },
      updateQuery: this.handleBookingChange
    });
  }

  handleBookingChange = (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev;

    const booking = subscriptionData.data.bookingChange;

    let updatedBookings;
    switch (booking.state) {
    case "reserved":
      updatedBookings = [booking, ...prev.place.bookings];
      break;
    case "canceled":
      updatedBookings = prev.place.bookings.filter(b => b.id !== booking.id);
      break;
    default:
      return prev;
    }

    return {
      place: {
        ...prev.place,
        bookings: updatedBookings
      }
    };
  };

  render() {
    const { place } = this.props;

    return (
      <CurrentUser>
        {currentUser => (
          <>
            {!currentUser && (
              <div className="booking">
                <BookingCalendar bookings={place.bookings} />
                <Link className="button" to="/sign-in">
                  Sign In To Book Dates
                </Link>
              </div>
            )}
            {currentUser && <CreateBooking place={place} />}
          </>
        )}
      </CurrentUser>
    );
  }
}

export default PlaceBookings;
