import React from "react";
import PropTypes from "prop-types";
import StarRatingComponent from "react-star-rating-component";

const RatingSelector = props => (
  <StarRatingComponent
    name="rating"
    starCount={5}
    value={props.rating}
    editing={props.editing}
    starColor="#ffb400"
    emptyStarColor="#333"
    onStarClick={props.onSelected}
  />
);

RatingSelector.propTypes = {
  rating: PropTypes.number.isRequired,
  editing: PropTypes.bool,
  onSelected: PropTypes.func
};

RatingSelector.defaultProps = {
  editing: true
};

export default RatingSelector;
