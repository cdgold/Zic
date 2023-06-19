import auth0Service from "./auth0.js"
import axios from "axios"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/followers`

const follow = async ({ userID, toFollowID, token }) => {
  userID = auth0Service.dropStartOfSub(userID)
  console.log(`user: ${userID}, toFollow: ${toFollowID}`)
  let config = {}
  config = auth0Service.setHeaderToken({ "config": config, "token": token })
  const response = await axios.post(baseUrl, { "followingID": toFollowID, "followerID": userID }, config)
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

const getFollowingPosts = async ({ userID, numPosts, userInfo }) => {
  userID = auth0Service.dropStartOfSub(userID)
  let getUrl = `${baseUrl}/following/posts/${userID}`
  if (numPosts){
    getUrl = `${getUrl}?numPosts=${numPosts}`
  }
  if (userInfo){
    getUrl = `${getUrl}?userInfo=${numPosts}`
  }
  const response = await axios.get(getUrl)
  let returnValue
  (response.status === 200) ? returnValue = response.data : returnValue = null
  return returnValue
}


export default { follow, unfollow, getFollowing, getFollowingPosts }