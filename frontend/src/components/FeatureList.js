import React from "react";
import PropTypes from "prop-types";

const FeatureList = ({ place }) => {
  const features = {
    wifi: "Wifi",
    pool: "Pool",
    petFriendly: "Pet-Friendly"
  };

  return (
    <ul className="features">
      {Object.keys(features).map(feature => (
        <li key={feature}>
          <i
            className={
              "fas fa-fw " + (place[feature] ? "fa-check" : "fa-times")
            }
          />
          {features[feature]}
        </li>
      ))}
    </ul>
  );
};

FeatureList.propTypes = {
  place: PropTypes.object.isRequired
};

export default FeatureList;
