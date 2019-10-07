import React, { Component } from "react";
import PropTypes from "prop-types";
import DayPicker, { DateUtils } from "react-day-picker";
import { DayPickerCaption } from "./DateRangeSelector";
import { subDays, addDays, parseISO } from "date-fns";

class BookingCalendar extends Component {
  static propTypes = {
    bookings: PropTypes.array.isRequired,
    selectedRange: PropTypes.shape({
      startDate: PropTypes.object,
      endDate: PropTypes.object
    }),
    onDayClick: PropTypes.func
  };

  static defaultProps = {
    selectedRange: {
      startDate: null,
      endDate: null
    }
  };

  disabledDays = () => {
    return this.props.bookings.map(booking => {
      return {
        after: subDays(parseISO(booking.startDate), 1),
        before: addDays(parseISO(booking.endDate), 1)
      };
    });
  };

  handleDayClick = (day, modifiers, event) => {
    if (modifiers.disabled) {
      return;
    }
    if (this.props.onDayClick) {
      // `DateUtils.addDayToRange` returns object with
      // `from` and `to` properties
      const updatedRange = DateUtils.addDayToRange(day, {
        from: this.props.selectedRange.startDate,
        to: this.props.selectedRange.endDate
      });

      // So need to transform back to `startDate` and `endDate`
      // properties expected by rest of application
      const newSelectedRange = {
        startDate: updatedRange.from,
        endDate: updatedRange.to
      };
      this.props.onDayClick(newSelectedRange);
    }
  };

  render() {
    const { startDate, endDate } = this.props.selectedRange;
    const modifiers = { start: startDate, end: endDate };

    return (
      <DayPicker
        className="booking-calendar"
        numberOfMonths={3}
        pagedNavigation
        fixedWeeks
        selectedDays={[startDate, { from: startDate, to: endDate }]}
        modifiers={modifiers}
        disabledDays={this.disabledDays()}
        onDayClick={this.handleDayClick}
        captionElement={({ date, localeUtils, locale }) => (
          <DayPickerCaption date={date} localeUtils={localeUtils} />
        )}
      />
    );
  }
}

export default BookingCalendar;
