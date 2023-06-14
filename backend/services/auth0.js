const { auth } = require("express-oauth2-jwt-bearer");
const axios = require("axios")
const dotenv = require("dotenv");

dotenv.config();

TIME_NEEDED_FOR_REFRESH_SECONDS = 31557600

let token = null
let tokenAcquisitionTime = null

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

const getUser = async (ID) => {
  checkTokenValidity()
  const config = {
    "headers": {
      "Authorization": token
    }
  }
  const getUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users/${ID}`
  const returnUser = await axios.get(getUrl, config)
  return returnUser.data
}

const searchUsersByNickname = async (query) => {
  query = query.replace(/\s/g, '')
  await checkTokenValidity()
  const config = {
    "headers": {
      "Authorization": token
    }
  }
  const getUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users?q=nickname:${query} OR nickname:${query}* OR user_id:*${query}&search_engine=v3`
  const getResponse = await axios.get(getUrl, config)
  return getResponse.data
}


const validateAccessToken = auth({
  issuerBaseURL: `${process.env.AUTH0_DOMAIN}`,
  audience: `${process.env.AUTH0_AUDIENCE}`,
  tokenSigningAlg: 'RS256'
})

const dropStartOfSub = (string) => {
  return string.split("|").pop()
}

module.exports = { getUser, searchUsersByNickname, validateAccessToken, dropStartOfSub }