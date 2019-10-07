import React, { Component } from "react";
import PropTypes from "prop-types";
import { formatCurrency, totalNights } from "../lib/helpers";

class BookingTotals extends Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    pricePerNight: PropTypes.string.isRequired
  };

  render() {
    const { startDate, endDate, pricePerNight } = this.props;

    const nights = totalNights(startDate, endDate);
    const price = nights * parseFloat(pricePerNight);

    return (
      <div className="booking-totals">
        {nights} nights &bull; {formatCurrency(price)}
      </div>
    );
  }
}

export default BookingTotals;
