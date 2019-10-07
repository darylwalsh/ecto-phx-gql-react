import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import RatingSelector from "./custom-inputs/RatingSelector";
import CreateReview from "../components/CreateReview";
import CurrentUser from "./CurrentUser";
import { distanceInWordsFromNow } from "../lib/helpers";

const PlaceReviews = ({ place }) => (
  <>
    <div className="reviews">
      <h2>Reviews</h2>
      <div>
        <ul>
          <TransitionGroup>
            {place.reviews.map(review => (
              <CSSTransition classNames="fade" key={review.id} timeout={1000}>
                <li key={review.id}>
                  <div className="user">
                    <i className="fas fa-user" />
                    <span className="name">{review.user.username}</span>
                    <span className="date">
                      {distanceInWordsFromNow(review.insertedAt)}
                    </span>
                  </div>
                  <RatingSelector rating={review.rating} editing={false} />
                  <p>{review.comment}</p>
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ul>
      </div>
    </div>
    <CurrentUser>
      {currentUser => (
        <>
          {!currentUser && (
            <p>
              <Link className="button" to="/sign-in">
                Sign In To Post A Review
              </Link>
            </p>
          )}
          {currentUser && <CreateReview place={place} />}
        </>
      )}
    </CurrentUser>
  </>
);

PlaceReviews.propTypes = {
  place: PropTypes.object.isRequired
};

export default PlaceReviews;
