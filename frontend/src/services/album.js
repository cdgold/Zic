
import axios from "axios"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/albums`

// gets item from database
const getAlbum = async ({ id }) => {
  const urlToGet = `${baseUrl}/${id}`
  const albumResponse = await axios.get(urlToGet)
  return albumResponse.data
}

// returns result from Spotify API search
const getSpotifyAlbum = async ({ id }) => {
  const urlToGet = `${baseUrl}/spotify/${id}`
  const albumResponse = await axios.get(urlToGet)
  return albumResponse.data
}

const getMultipleSpotifyAlbums = async (idArray) => {
  const urlToPost = `${baseUrl}/spotify/`
  const albumResponse = await axios.post(urlToPost, idArray)
  return albumResponse.data
}

const searchSpotify = async ({ query }) => {
  const urlToGet = `${baseUrl}/searchSpotify/${query}`
  console.log("going to: ", urlToGet)
  const searchResponse = await axios.get(urlToGet)
  console.log(searchResponse)
  if (searchResponse.data.length > 0){
    return searchResponse.data
  }
  return null
}

const getIDfromURI = (uri) => {
  const id = uri.split(":")[2]
  return id
}

export default {
  getAlbum,
  searchSpotify,
  getSpotifyAlbum,
  getMultipleSpotifyAlbums,
  getIDfromURI
}