import axios from "axios"
import auth0Service from "./auth0.js"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/songRatings`

const postMultiple = async ({ ratings, token, albumID }) => {
  let config = {}
  config = auth0Service.setHeaderToken({ "config": config, "token": token })
  let newRatings = { ...ratings }
  Object.keys(newRatings).forEach(function(trackID) {
    if(!(isNaN(newRatings[trackID]))){
      newRatings[trackID] = newRatings[trackID] * 10
    }})
  const urlToPost = `${baseUrl}/album`
  console.log("posting to: ", urlToPost, " with ", newRatings)
  const albumRatingResponse = await axios.post(urlToPost, { "trackRatings": newRatings, "albumID": albumID }, config)
  return albumRatingResponse.data
}

export default {
  postMultiple
}