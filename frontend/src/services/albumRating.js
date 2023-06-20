
import axios from "axios"
import auth0Service from "./auth0.js"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/albumRatings`

const stringifyRating = ({ rating }) => {
  let ratingString = `${rating}`
  if (ratingString.length === 1){
    ratingString = `0.${ratingString}`
  }
  else if (ratingString.length === 2){
    ratingString = ratingString[0] + "." + ratingString[1]
  }
  else {  // rating string 3 digits, must be 10.0
    ratingString = "10.0"
  }
  return ratingString
}

const getRating = async ({ userID, albumID }) => {
  userID = auth0Service.dropStartOfSub(userID)
  const urlToGet = `${baseUrl}/${userID}/${albumID}`
  let albumRatingResponse = await axios.get(urlToGet)
  console.log("albumRatingResponse is", albumRatingResponse)
  let albumReview
  let trackReviews
  if (albumRatingResponse.status === "200"){
    albumReview = albumRatingResponse.data.album
    if (typeof albumReview !== "undefined" && typeof albumReview.rating !== "undefined"){
      albumReview.rating = stringifyRating({ "rating": albumReview.rating })
    }
    trackReviews = albumRatingResponse.data.tracks
    trackReviews = trackReviews.map((track) => {
      if (typeof track.rating !== "undefined" && !(isNaN(typeof track.rating))){
        track.rating = stringifyRating({ "rating": track.rating })
      }
      return(track)
    })
  }
    else { // status is not 200
      return null
    }
  const albumAndTracks = {"album": albumReview, "tracks": trackReviews}
  console.log("albumAndTracks is: ", albumAndTracks)
  return albumAndTracks
}

const postRating = async ({ rating, token }) => {
  let config = {}
  config = auth0Service.setHeaderToken({ "config": config, "token": token })
  const newUserID = auth0Service.dropStartOfSub(rating.userID)
  rating["userID"] = newUserID
    const urlToPost = `${baseUrl}`
    if (typeof rating.review.rating !== "undefined" && !(isNaN(rating.review.rating))){
      rating.review.rating = rating.review.rating * 10
    }
    console.log("posting to: ", urlToPost, " with ", rating)
    const albumRatingResponse = await axios.post(urlToPost, rating, config)
    return albumRatingResponse.data
  }

const getAllUserRatings = async ({ userID }) => {
  const newUserID = auth0Service.dropStartOfSub(userID)
  let config = {}
  //auth0Service.setHeaderToken({ config, accessToken })
  const urlToGet = `${baseUrl}/user/${newUserID}`
  const userRatingsResponse = await axios.get(urlToGet, config)
  return userRatingsResponse.data
} 

export default {
  getRating,
  postRating,
  getAllUserRatings
}