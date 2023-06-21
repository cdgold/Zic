
import axios from "axios"
import auth0Service from "./auth0.js"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/users`

let token = null

const search = async ({ query }) => {
  const config = {}
  const getUrl = `${baseUrl}/search/${query}`
  const userResponse = await axios.get(getUrl, config)
  console.log(`Returning: ${userResponse.data}`)
  return userResponse.data
}

const getUserProfile = async ({ userID }) => {
    const getUrl = `${baseUrl}/${userID}`
    const userResponse = await axios.get(getUrl)
    return userResponse.data
}

const patchUser = async ({ changes, token }) => {
  let config = {}
  config = auth0Service.setHeaderToken({"config": config, "token": token})
  console.log("changes: ", changes)
  const patchResponse = await axios.patch(baseUrl, changes, config)
  return patchResponse.data
}

export default {
  search, patchUser, getUserProfile
}