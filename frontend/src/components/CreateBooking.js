import React, { Component } from "react";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import Error from "./Error";
import BookingTotals from "./BookingTotals";
import BookingCalendar from "./custom-inputs/BookingCalendar";
import { formatYYYYMMDD } from "../lib/helpers";
import { GET_MY_BOOKINGS_QUERY } from "../pages/MyBookings";

const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking(
    $placeId: ID!
    $startDate: String!
    $endDate: String!
  ) {
    createBooking(placeId: $placeId, startDate: $startDate, endDate: $endDate) {
      id
    }
  }
`;

class CreateBooking extends Component {
  static propTypes = {
    place: PropTypes.object.isRequired
  };

  state = {
    startDate: null,
    endDate: null
  };

  handleDayClick = newDateRange => {
    this.setState(newDateRange);
  };

  clearState = () => {
    this.setState({ startDate: null, endDate: null });
  };

  hasPickedDates = () => {
    return this.state.startDate && this.state.endDate;
  };

  render() {
    const { place } = this.props;

    return (
      <Mutation
        mutation={CREATE_BOOKING_MUTATION}
        variables={{
          placeId: place.id,
          startDate: formatYYYYMMDD(this.state.startDate),
          endDate: formatYYYYMMDD(this.state.endDate)
        }}
        onCompleted={this.clearState}
        refetchQueries={[{ query: GET_MY_BOOKINGS_QUERY }]}>
        {(createBooking, { loading, error }) => (
          <div className="booking">
            <Error error={error} />
            <BookingCalendar
              bookings={place.bookings}
              selectedRange={this.state}
              onDayClick={this.handleDayClick}
            />
            {this.hasPickedDates() && (
              <BookingTotals
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                pricePerNight={place.pricePerNight}
              />
            )}
            <button
              disabled={loading || !this.hasPickedDates()}
              onClick={createBooking}>
              Book These Dates
            </button>
          </div>
        )}
      </Mutation>
    );
  }
}

export default CreateBooking;
