import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/helpers";

const PlaceCard = ({ place }) => (
  <div className="card-column">
    <div className="card">
      <Link to={`/places/${place.slug}`}>
        <img src={place.imageThumbnail} alt={place.name} />
      </Link>
      <div className="card-body">
        <h3 className="name">
          <Link to={`/places/${place.slug}`}>{place.name}</Link>
        </h3>
        <h4 className="location">{place.location}</h4>
        <p className="description">{place.description}</p>
      </div>
      <div className="card-footer">
        <div className="details">
          <span className="maxGuests">Sleeps {place.maxGuests}</span>
          <span className="price">
            {formatCurrency(place.pricePerNight)}/night
          </span>
        </div>
      </div>
    </div>
  </div>
);

PlaceCard.propTypes = {
  place: PropTypes.object.isRequired
};

export default PlaceCard;
