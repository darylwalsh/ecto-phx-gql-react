import React, { Component } from "react";
import PropTypes from "prop-types";
import PlaceCard from "../components/PlaceCard";
import NoData from "./NoData";

class PlaceList extends Component {
  static propTypes = {
    places: PropTypes.array.isRequired
  };

  render() {
    const { places } = this.props;

    if (places.length === 0) return <NoData />;

    return (
      <div className="places">
        {places.map(place => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    );
  }
}

export default PlaceList;
