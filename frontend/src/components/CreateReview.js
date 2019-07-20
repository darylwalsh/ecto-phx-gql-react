import React, { Component } from "react";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import Error from "./Error";
import Loading from "../components/Loading";
import RatingSelector from "./custom-inputs/RatingSelector";
import { GET_PLACE_QUERY } from "../pages/Place";

const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($placeId: ID!, $comment: String!, $rating: Int!) {
    createReview(placeId: $placeId, comment: $comment, rating: $rating) {
      id
      comment
      rating
      insertedAt
      user {
        username
      }
    }
  }
`;

class CreateReview extends Component {
  static propTypes = {
    place: PropTypes.object.isRequired
  };

  state = {
    comment: "",
    rating: 0
  };

  handleCommentChange = event => {
    this.setState({ comment: event.target.value });
  };

  handleRatingSelected = (nextValue, prevValue, name) => {
    this.setState({ rating: nextValue });
  };

  clearState = () => {
    this.setState({ comment: "", rating: 0 });
  };

  handleUpdate = (cache, { data }) => {
    const { slug } = this.props.place;

    // 1. Read the place from the cache
    const { place } = cache.readQuery({
      query: GET_PLACE_QUERY,
      variables: { slug: slug }
    });

    // 2. Add the new review to beginning of array
    place.reviews.unshift(data.createReview);

    // 3. Write the updated place back to the cache
    cache.writeQuery({
      query: GET_PLACE_QUERY,
      variables: { slug: slug },
      data: { place: place }
    });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_REVIEW_MUTATION}
        variables={{
          ...this.state,
          placeId: this.props.place.id
        }}
        onCompleted={this.clearState}
        update={this.handleUpdate}>
        {(createReview, { loading, error }) => {
          if (loading) return <Loading />;
          return (
            <form
              className="review"
              onSubmit={e => {
                e.preventDefault();
                createReview();
              }}>
              <Error error={error} />
              <fieldset>
                <div className="comment">
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    name="comment"
                    id="comment"
                    placeholder="Your Comment..."
                    required
                    value={this.state.comment}
                    onChange={this.handleCommentChange}
                  />
                </div>
                <div className="rating">
                  <RatingSelector
                    rating={this.state.rating}
                    onSelected={this.handleRatingSelected}
                  />
                </div>
                <button type="submit">Post Review</button>
              </fieldset>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateReview;
