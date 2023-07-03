import auth0Service from "./auth0.js"
import axios from "axios"

import albumRatingService from "./albumRating.js"

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
  //console.log("requesting: ", getUrl)
  if (numPosts){
    getUrl = `${getUrl}?numPosts=${numPosts}`
  }
  if (userInfo){
    getUrl = `${getUrl}?userInfo=${userInfo}`
  }
  const response = await axios.get(getUrl)
  //console.log("Returned ", response.data, " with userID: ", userID)
  let returnValue
  if(response.status === 200){
    response.data.posts.forEach((element, index, array) => {
      if (typeof element.rating !== "undefined"){
        array[index].rating = albumRatingService.stringifyRating({ "rating": element.rating })
      }
    })
    console.log(response.data)
    returnValue = response.data
  } else {
    returnValue = null
  }
  return returnValue
}


export default { follow, unfollow, getFollowing, getFollowingPosts }