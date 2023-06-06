
const axios = require("axios")

const SPOTIFY_API_ID = "0825b2f46d4e47d5be867f88b89ec70b"
const SPOTIFY_SECRET = `${process.env.SPOTIFY_SECRET}`
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1"
const ACCEPTABLE_SEARCH_TYPES = ["album", "artist", "track"]

TIME_NEEDED_FOR_REFRESH_SECONDS = 3600
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow - for implementing playlist saving, listen history, etc.

let token = null
let tokenAcquisitionTime = null

const getAndSetToken = async () => {
    const config = {
      headers:{
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
    const spotifyReqBody = `grant_type=client_credentials&client_id=${SPOTIFY_API_ID}&client_secret=${SPOTIFY_SECRET}`
    const spotifyResponse = await axios.post(SPOTIFY_TOKEN_URL, spotifyReqBody, config)
    token = `Bearer ${spotifyResponse.data.access_token}`
  }

const checkTokenValidity = async () => {
    if (tokenAcquisitionTime === null || Date.now() === tokenAcquisitionTime.now() + (TIME_NEEDED_FOR_REFRESH_SECONDS * 1000)){
        await getAndSetToken()
    }
}

const getWithID = async ({ id, type }) => {
    await checkTokenValidity()
    let config = {}
    if(token !== null){
      config = {
        headers:{
          "Authorization": token
        }
      }
    }
    else {
      throw new Error("Set Spotify API key first.")
    }
    if (ACCEPTABLE_SEARCH_TYPES.includes(type)){
      const getRequestUrl = `${SPOTIFY_BASE_URL}/${type}s/${id}`
      const response = await axios.get(getRequestUrl, config)
      return(response.data)
    }
    else{
      throw new Error("Invalid type for get request.")
    }
  }


//returns array of search results
const search = async ({ query, type }) => {
  await checkTokenValidity()
  let config = {}
  if(token !== null){
    config = {
      headers:{
        "Authorization": token
      }
    }
  }
  else {
    throw new Error("Set Spotify API key first.")
  }
  if (ACCEPTABLE_SEARCH_TYPES.includes(type)){
    const searchRequestUrl = `${SPOTIFY_BASE_URL}/search/?q=${query}&type=${type}`
    const response = await axios.get(searchRequestUrl, config)
      if (type == "album"){
        return response.data.albums.items
      }
      else{
        return response.data
      }
  }
  else{
    throw new Error("Invalid search type.")
  }
}


module.exports = {getAndSetToken, search, getWithID}