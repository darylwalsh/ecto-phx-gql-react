import React, { Component } from "react";
import PropTypes from "prop-types";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { differenceInMonths, parseISO } from "date-fns";
import { DateUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";

class DateRangeSelector extends Component {
  static propTypes = {
    currentRange: PropTypes.object,
    onDateRangeChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    if (props.currentRange) {
      this.state = {
        from: parseISO(props.currentRange.startDate),
        to: parseISO(props.currentRange.endDate)
      };
    } else {
      this.state = {
        from: undefined,
        to: undefined
      };
    }
  }

  handleFromChange = from => {
    this.setState({ from });

    this.notifyOnDateRangeChange(from, this.state.to);
  };

  handleToChange = to => {
    this.setState({ to }, this.showFromMonth);

    this.notifyOnDateRangeChange(this.state.from, to);
  };

  notifyOnDateRangeChange = (from, to) => {
    if (from && to) {
      this.props.onDateRangeChange(from, to);
    }
  };

  showFromMonth = () => {
    const { from, to } = this.state;
    if (!from) return;
    if (differenceInMonths(to, from) < 2) {
      this.to.getDayPicker().showMonth(from);
    }
  };

  parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };

  formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };

    const FORMAT = "MMMM d";

    return (
      <>
        <div className="InputFromTo">
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <i className="fas fa-calendar-alt" />
              </div>
            </div>
            <DayPickerInput
              value={from}
              formatDate={this.formatDate}
              format={FORMAT}
              parseDate={this.parseDate}
              placeholder="From..."
              dayPickerProps={{
                selectedDays: [from, { from, to }],
                disabledDays: { after: to },
                toMonth: to,
                modifiers,
                numberOfMonths: 2,
                onDayClick: () => this.to.getInput().focus(),
                captionElement: ({ date, localeUtils, locale }) => (
                  <DayPickerCaption date={date} localeUtils={localeUtils} />
                )
              }}
              onDayChange={this.handleFromChange}
            />
          </div>
          <span className="InputFromTo-to">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fas fa-calendar-alt" />
                </div>
              </div>
              <DayPickerInput
                ref={el => (this.to = el)}
                value={to}
                placeholder="To..."
                formatDate={this.formatDate}
                format={FORMAT}
                parseDate={this.parseDate}
                dayPickerProps={{
                  selectedDays: [from, { from, to }],
                  disabledDays: { before: from },
                  modifiers,
                  month: from,
                  fromMonth: from,
                  numberOfMonths: 2,
                  captionElement: ({ date, localeUtils, locale }) => (
                    <DayPickerCaption date={date} localeUtils={localeUtils} />
                  )
                }}
                onDayChange={this.handleToChange}
              />
            </div>
          </span>
        </div>
      </>
    );
  }
}

function DayPickerCaption({ date, localeUtils, locale }) {
  const months = localeUtils.getMonths();

  return (
    <div className="DayPicker-Caption">
      {months
        ? `${months[date.getMonth()]}`
        : localeUtils.formatMonthTitle(date, locale)}
    </div>
  );
}

export default DateRangeSelector;
export { DayPickerCaption };
