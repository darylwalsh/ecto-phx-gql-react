import React, { Component } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import DateRangeSelector from "./DateRangeSelector";
import ThreeStateCheckbox from "./ThreeStateCheckbox";
import { formatYYYYMMDD } from "../../lib/helpers";

class SearchCriteria extends Component {
  static propTypes = {
    criteria: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  notifyOnChange = newCriteria => {
    this.props.onChange(newCriteria);
  };

  clear = () => {
    this.notifyOnChange({});
  };

  handleMatchingChange = debounce(event => {
    const { value } = event.target;

    let newValue;
    if (value) {
      newValue = value;
    } else {
      newValue = undefined;
    }

    const newCriteria = {
      ...this.props.criteria,
      matching: newValue
    };

    this.notifyOnChange(newCriteria);
  }, 300);

  handleDateRangeChange = (from, to) => {
    const currentRange = {
      ...this.props.criteria.availableBetween
    };

    if (from) {
      currentRange.startDate = formatYYYYMMDD(from);
    }
    if (to) {
      currentRange.endDate = formatYYYYMMDD(to);
    }

    const newCriteria = {
      ...this.props.criteria,
      availableBetween: currentRange
    };

    this.notifyOnChange(newCriteria);
  };

  handleCheckboxChange = (name, value) => {
    let newValue;
    switch (value) {
    case 1:
      newValue = true;
      break;
    case 2:
      newValue = false;
      break;
    default:
      newValue = undefined;
    }

    const newCriteria = {
      ...this.props.criteria,
      [name]: newValue
    };

    this.notifyOnChange(newCriteria);
  };

  handleGuestCountAdd = () => {
    const currentCount = this.props.criteria.guestCount || 1;

    const newCount = currentCount + 1;

    const newCriteria = {
      ...this.props.criteria,
      guestCount: newCount
    };

    this.notifyOnChange(newCriteria);
  };

  handleGuestCountSubtract = () => {
    const currentCount = this.props.criteria.guestCount || 1;

    let newCount = currentCount;
    if (currentCount >= 2) {
      newCount = currentCount - 1;
    }

    const newCriteria = {
      ...this.props.criteria,
      guestCount: newCount
    };

    this.notifyOnChange(newCriteria);
  };

  checkboxValue = feature => {
    switch (this.props.criteria[feature]) {
    case true:
      return 1;
    case false:
      return 2;
    default:
      return 0;
    }
  };

  render() {
    const { criteria } = this.props;

    return (
      <div className="search-criteria">
        <h4>Where</h4>
        <div className="input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <i className="fas fa-search" />
            </div>
          </div>
          <input
            type="search"
            name="matching"
            placeholder="Search..."
            defaultValue={criteria.matching}
            key={criteria.matching}
            autoFocus
            onChange={e => {
              e.persist();
              this.handleMatchingChange(e);
            }}
          />
        </div>
        <h4>When</h4>
        <DateRangeSelector
          key={criteria.availableBetween}
          currentRange={criteria.availableBetween}
          onDateRangeChange={this.handleDateRangeChange}
        />
        <h4>How Many</h4>
        <div className="input-group">
          <div className="input-group-prepend">
            <button
              onClick={e => {
                e.persist();
                this.handleGuestCountSubtract();
              }}>
              <i className="fas fa-minus" />
            </button>
          </div>
          <input
            name="guestCount"
            type="number"
            className="form-control"
            key={criteria.guestCount}
            defaultValue={criteria.guestCount}
            readOnly
          />
          <div className="input-group-append">
            <button
              onClick={e => {
                e.persist();
                this.handleGuestCountAdd();
              }}>
              <i className="fas fa-plus" />
            </button>
          </div>
        </div>
        <h4>What</h4>
        <ul>
          <li>
            <ThreeStateCheckbox
              name="petFriendly"
              label="Pet Friendly"
              key={this.checkboxValue("petFriendly")}
              status={this.checkboxValue("petFriendly")}
              onChange={(name, value) => {
                this.handleCheckboxChange(name, value);
              }}
            />
          </li>
          <li>
            <ThreeStateCheckbox
              name="pool"
              label="Pool"
              key={this.checkboxValue("pool")}
              status={this.checkboxValue("pool")}
              onChange={(name, value) => {
                this.handleCheckboxChange(name, value);
              }}
            />
          </li>
          <li>
            <ThreeStateCheckbox
              name="wifi"
              label="Wifi"
              key={this.checkboxValue("wifi")}
              status={this.checkboxValue("wifi")}
              onChange={(name, value) => {
                this.handleCheckboxChange(name, value);
              }}
            />
          </li>
        </ul>
        <div className="clear">
          <button onClick={this.clear}>Clear All</button>
        </div>
      </div>
    );
  }
}

export default SearchCriteria;
