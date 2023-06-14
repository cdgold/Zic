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

const unfollow = async ({ userID, toUnfollowID, token }) => {
    userID = auth0Service.dropStartOfSub(userID)
    console.log(`user: ${userID}, toUnfollow: ${toUnfollowID}, token: ${token}`)
    let config = {}
    config = auth0Service.setHeaderToken({ "config": config, "token": token })
    const deleteUrl = `${baseUrl}/${toUnfollowID}`
    const response = await axios.delete(deleteUrl, config)
    return response.data
}

const getFollowing = async ({ userID }) => {
    userID = auth0Service.dropStartOfSub(userID)
    const getUrl = `${baseUrl}/following/${userID}`
    const response = await axios.get(getUrl)
    return response.data
}


export default { follow, unfollow, getFollowing }