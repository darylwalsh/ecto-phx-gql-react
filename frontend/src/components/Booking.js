import React, { Component } from "react";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import { formatMonthDD, totalNights, formatCurrency } from "../lib/helpers";

const CANCEL_BOOKING_MUTATION = gql`
  mutation CancelBooking($bookingId: Int!) {
    cancelBooking(bookingId: $bookingId) {
      id
      state
    }
  }
`;

class Booking extends Component {
  static propTypes = {
    booking: PropTypes.object.isRequired
  };

  isReserved = () => {
    return this.props.booking.state === "reserved";
  };

  render() {
    const { booking } = this.props;

    return (
      <div className="booking" key={booking.id}>
        <div className="body">
          <div className="columns">
            <div className="place">
              <Link to={`/places/${booking.place.slug}`}>
                <img
                  src={booking.place.imageThumbnail}
                  alt={booking.place.name}
                />
                <span className="name">{booking.place.name}</span>
              </Link>
            </div>
            <div className="dates">
              <dl>
                <dt>Arriving</dt>
                <dd>{formatMonthDD(booking.startDate)}</dd>
                <dt>Departing</dt>
                <dd>{formatMonthDD(booking.endDate)}</dd>
              </dl>
            </div>
            <div className="status">
              <span className={"state " + booking.state}>{booking.state}</span>
              {this.isReserved() && (
                <Mutation
                  mutation={CANCEL_BOOKING_MUTATION}
                  variables={{ bookingId: booking.id }}>
                  {cancel => <button onClick={cancel}>Cancel</button>}
                </Mutation>
              )}
            </div>
          </div>
        </div>
        <div className="footer">
          {totalNights(booking.startDate, booking.endDate)} nights &bull;{" "}
          {formatCurrency(booking.totalPrice)}
        </div>
      </div>
    );
  }
}

export default Booking;
