
import axios from "axios"
import auth0Service from "./auth0.js"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/albumRatings`

const getRating = async ({ userID, albumID }) => {
  userID = auth0Service.dropStartOfSub(userID)
  const urlToGet = `${baseUrl}/${userID}/${albumID}`
  console.log("going to: ", urlToGet)
  const albumRatingResponse = await axios.get(urlToGet)
  console.log("albumRatingResponse is", albumRatingResponse)
  if(albumRatingResponse.status === "204"){
    return null
  }
  return albumRatingResponse.data
}

const postRating = async ({ rating }) => {
  const newUserID = auth0Service.dropStartOfSub(rating.userID)
  rating["userID"] = newUserID
    const urlToPost = `${baseUrl}`
    console.log("posting to: ", urlToPost, " with ", rating)
    const albumRatingResponse = await axios.post(urlToPost, rating)
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