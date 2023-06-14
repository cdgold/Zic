import auth0Service from "./auth0.js"
import axios from "axios"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/followers`

const follow = async ({ userID, toFollowID, token }) => {
  userID = auth0Service.dropStartOfSub(userID)
  console.log(`user: ${userID}, toFollow: ${toFollowID}, token: ${token}`)
  let config = {}
  config = auth0Service.setHeaderToken({ "config": config, "token": token })
  const response = await axios.post(baseUrl, { "followingID": userID, "followerID": toFollowID }, config)
  return response.data
}


export default { follow }