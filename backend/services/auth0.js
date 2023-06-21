const { auth } = require("express-oauth2-jwt-bearer");
const axios = require("axios")
const dotenv = require("dotenv");

dotenv.config();

TIME_NEEDED_FOR_REFRESH_SECONDS = 31557600

let token = null
let tokenAcquisitionTime = null

const dropStartOfSub = (string) => {
  return string.split("|").pop()
}

const trimUserResponse = ({ user }) => {
  const trimmedUser = {
    "nickname": user.nickname,
    "picture": user.picture,
    "userID": dropStartOfSub(user.user_id)
  }
  return trimmedUser
}

const trimUserResponses = ({ userArray }) => {
  const trimmedResponses = userArray.map(response => {
    const trimmedUser = {
      "nickname": response.nickname,
      "picture": response.picture,
      "userID": dropStartOfSub(response.user_id)
    }
    return trimmedUser
  })
  return trimmedResponses
}

const setToken = async () => {
    const postUrl = `${process.env.AUTH0_DOMAIN}/oauth/token`
    const options = {
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    };
    const requestBody = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${process.env.AUTH0_CLIENT_ID}`,
      client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
      audience: `${process.env.AUTH0_MANAGEMENT_AUDIENCE}`
    })
    const response = await axios.post(postUrl, requestBody, options)
    token = `Bearer ${response.data.access_token}`
  }

const checkTokenValidity = async () => {
    if (token === null || tokenAcquisitionTime === null || Date.now() === tokenAcquisitionTime.now() + (TIME_NEEDED_FOR_REFRESH_SECONDS * 1000)){
        await setToken()
    }
}

const getUserByID = async (ID) => {
  await checkTokenValidity()
  const config = {
    "headers": {
      "Authorization": token
    }
  }
  const getUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users/auth0|${ID}`
  const returnUser = await axios.get(getUrl, config)
  return returnUser.data
}

const patchUser = async ({ patchBody, userSub }) => {
  await checkTokenValidity()
  const config = {
    "headers": {
      "Authorization": token
    }
  }
  const patchUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users/${userSub}`
  const auth0Response = await axios.patch(patchUrl, patchBody, config)
  return auth0Response.data
}

const searchUsersByNickname = async (query) => {
  query = query.replace(/\s/g, '')
  await checkTokenValidity()
  const config = {
    "headers": {
      "Authorization": token
    }
  }
  const getUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users?q=nickname:${query} OR nickname:${query}*&search_engine=v3`
  const getResponse = await axios.get(getUrl, config)
  return getResponse.data
}

const getMultipleUsersByID = async ({ toGet }) => {
  if (Array.isArray(toGet)){
    await checkTokenValidity()
    const config = {
      "headers": {
        "Authorization": token
      }
    }
    let getUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users?q=user_id:auth0|${toGet[0]}`
    if (toGet.length > 1){
      for (let i=1; i < toGet.length; i++){
        getUrl = `${getUrl} OR user_id:auth0|${toGet[i]}`
      }
    }
    getUrl = `${getUrl}&search_engine=v3`
    const getResponse = await axios.get(getUrl, config)
    //console.log("Returning: ", getResponse.data)
    return getResponse.data
  }
  else {
    throw new Error("Pass toGet as array for function getMultipleUsersByID.")
  }
}


const validateAccessToken = auth({
  issuerBaseURL: `${process.env.AUTH0_DOMAIN}`,
  audience: `${process.env.AUTH0_AUDIENCE}`,
  tokenSigningAlg: 'RS256'
})

module.exports = { getUserByID, 
  searchUsersByNickname, 
  validateAccessToken, 
  dropStartOfSub, 
  patchUser, 
  getMultipleUsersByID,
  trimUserResponses,
  trimUserResponse }