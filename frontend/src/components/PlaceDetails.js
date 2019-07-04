import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../lib/helpers";
import FeatureList from "./FeatureList";

const PlaceDetails = ({ place }) => (
  <>
    <h1>{place.name}</h1>
    <h2>{place.location}</h2>
    <div className="columns">
      <div className="image">
        <img src={place.image} alt={place.name} />
      </div>
      <div className="details">
        <p className="description">{place.description}</p>
        <div className="maxGuests">
          <i className="fas fa-bed" />
          Sleeps {place.maxGuests}
        </div>
        <FeatureList place={place} />
        <h4 className="price">{formatCurrency(place.pricePerNight)}/night</h4>
      </div>
    </div>
  </>
);

PlaceDetails.propTypes = {
  place: PropTypes.object.isRequired
};

export default PlaceDetails;
