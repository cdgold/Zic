
import axios from "axios"

//MOVE TO BACKEND!!

const SPOTIFY_API_ID = "0825b2f46d4e47d5be867f88b89ec70b"
const SPOTIFY_SECRET = `${process.env.REACT_APP_SPOTIFY_SECRET}`
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search"
const ACCEPTABLE_SEARCH_TYPES = ["album", "artist", "track"]

let token = null

const getAndSetToken = async () => {
  const config = {
    headers:{
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
  const spotifyReqBody = `grant_type=client_credentials&client_id=${SPOTIFY_API_ID}&client_secret=${SPOTIFY_SECRET}`
  console.log("spotify req body is: ", spotifyReqBody)
  const spotifyResponse = await axios.post(SPOTIFY_TOKEN_URL, spotifyReqBody, config)
  console.log(spotifyResponse.data.access_token)
  token = `Bearer ${spotifyResponse.data.access_token}`
}

const search = async ({ query, type }) => {
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
  console.log("Searching: ", query, " of type ", type)
  if (ACCEPTABLE_SEARCH_TYPES.includes(type)){
    const searchRequestUrl = `${SPOTIFY_SEARCH_URL}?q=${query}&type=${type}`
    const response = await axios.get(searchRequestUrl, config)
     console.log(response.data)
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

export default {
  getAndSetToken,
  search
}