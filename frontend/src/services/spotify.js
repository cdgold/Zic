import axios from "axios"

let codeVerifier = null

const clientId = `${process.env.REACT_APP_SPOTIFY_ID}`
const redirectUri = `${process.env.REACT_APP_REDIRECT}/albumRatings`

function generateRandomString(length) {
  let text = ""
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier) {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest("SHA-256", data)

  return base64encode(digest)
}



const getUserAuthorization = () => {
  codeVerifier = generateRandomString(128)
  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    let state = generateRandomString(16)
    let scope = "user-top-read user-follow-read"

    localStorage.setItem("code_verifier", codeVerifier)

    let args = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge
    })

    window.location = "https://accounts.spotify.com/authorize?" + args
  })
}

const getAndSetTokenWithCode = async ({ code }) => {
  const storedCodeVerifier = localStorage.getItem("code_verifier")
  if (localStorage.getItem("access_token") === null && storedCodeVerifier !== null){
    const config = {
      "headers": { "Content-Type": "application/x-www-form-urlencoded" }
    }
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: storedCodeVerifier
    })
    const axiosResponse = await axios.post("https://accounts.spotify.com/api/token", body, config)
    console.log("Received back: ", axiosResponse)
    localStorage.setItem("spotify_access_token", axiosResponse.data.access_token)
    localStorage.setItem("spotify_refresh_token", axiosResponse.data.access_token)
  } else {
    console.log("Token already set.")
  }
}

const getMostPlayed = async () => {
  let accessToken = localStorage.getItem("spotify_access_token")
  if (accessToken === null) {
    throw new Error("Get access token before getting spotify data")
  }
  const response = await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term", {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  })
  console.log(response.data)
  return response.data
}

export default { getUserAuthorization, getAndSetTokenWithCode, getMostPlayed }