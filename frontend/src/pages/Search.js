import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "../components/Error";
import Loading from "../components/Loading";
import PlaceList from "../components/PlaceList";
import SearchCriteria from "../components/custom-inputs/SearchCriteria";

const SEARCH_PLACES_QUERY = gql`
  query SearchPlaces($filter: PlaceFilter!) {
    places(filter: $filter) {
      id
      slug
      name
      location
      description
      pricePerNight
      imageThumbnail
      maxGuests
    }
  }
`;

class Search extends Component {
  state = {
    criteria: {}
  };

  handleCriteriaChange = criteria => {
    this.setState({ criteria: criteria });
  };

  render() {
    return (
      <div className="search">
        <SearchCriteria
          criteria={this.state.criteria}
          onChange={this.handleCriteriaChange}
        />
        <div className="search-results">
          <Query
            query={SEARCH_PLACES_QUERY}
            variables={{
              filter: this.state.criteria
            }}>
            {({ data, loading, error }) => {
              if (loading) return <Loading />;
              if (error) return <Error error={error} />;

              return (
                <>
                  <h5>{data.places.length} Places Await...</h5>
                  <PlaceList places={data.places} />
                </>
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default Search;
