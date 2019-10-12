import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Error from '../components/Error'
import Loading from '../components/Loading'
import PlaceList from '../components/PlaceList'

const GET_PLACES_QUERY = gql`
  query GetPlaces($limit: Int!, $offset: Int) {
    places(limit: $limit, offset: $offset) {
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
`
const LIMIT = 3

class Home extends React.Component {
  state = {
    hasMorePlaces: true,
  }
  render() {
    return (
      <Query query={GET_PLACES_QUERY} variables={{ limit: LIMIT, offset: 0 }}>
        {({ data, loading, error, fetchMore }) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} />
          return (
            <>
              <PlaceList places={data.places} />
              <div className="more">
                <button
                  disabled={!this.state.hasMorePlaces}
                  onClick={() =>
                    fetchMore({
                      variables: {
                        offset: data.places.length,
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return previousResult
                        if (fetchMoreResult.places.length < LIMIT) {
                          this.setState({ hasMorePlaces: false })
                        }
                        return {
                          places: [
                            ...previousResult.places,
                            ...fetchMoreResult.places,
                          ],
                        }
                      },
                    })
                  }>
                  See More
                </button>
              </div>
            </>
          )
        }}
      </Query>
    )
  }
}

export default Home
