
import axios from "axios"
import auth0Service from "./auth0.js"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/albumRatings`

const getRating = async ({ userID, albumID }) => {
  userID = auth0Service.dropSubPrefix(userID)
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
  const newUserID = auth0Service.dropSubPrefix(rating.userID)
  rating["userID"] = newUserID
    const urlToPost = `${baseUrl}`
    console.log("posting to: ", urlToPost, " with ", rating)
    const albumRatingResponse = await axios.post(urlToPost, rating)
    return albumRatingResponse.data
  }


export default {
  getRating,
  postRating
}