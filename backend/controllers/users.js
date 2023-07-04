
const dbpool = require("../utils/databaseConfig.js")
const usersRouter = require("express").Router()
const axios = require("axios")
const auth0Service = require("../services/auth0.js")
const spotifyService = require("../services/spotify.js")

const MINIMUM_DISPLAY_NAME_LENGTH = 4
const MAXIMUM_DISPLAY_NAME_LENGTH = 16
const POSSIBLE_AVATARS_TO_RETURN = 12

usersRouter.get("/", async (request, response) => {
  //const users = await dbpool.query(`SELECT * FROM "users" WHERE auth0_id = $1`, [ID])
  const config = {
    "headers": {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFfX1poUEt4MlpVTXJHbGg4eTBwMCJ9'
    }
  }
  const getUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users/`
  const returnUser = await axios.get(getUrl, config)

  response.json(returnUser)
})

usersRouter.get("/:auth0ID", async (request, response) => {
  const ID = request.params.auth0ID
  const returnUser = await auth0Service.getUserByID(ID)
  const trimmedUser = auth0Service.trimUserResponse({ "user": returnUser })
  response.status(200).json(trimmedUser)
})

usersRouter.get("/search/:query", async (request, response) => {
  console.log(`
  user: ${process.env.DATABASE_LOGIN},
  database: ${process.env.DATABASE_NAME},
  password: ${process.env.DATABASE_PASSWORD},
  port: 5432,
  host: ${process.env.DATABASE_URL},
  `)
  const query = request.params.query
  const auth0Response = await auth0Service.searchUsersByNickname(query)
  const trimmedResponses = auth0Service.trimUserResponses({ "userArray": auth0Response })
  response.status(200).json(trimmedResponses)
})

// need auth0ID and displayName

usersRouter.post("/", async (request, response) => {
  if (typeof request.body.auth0ID === "undefined"){
    return response.status(401).json({
      error: "missing auth0ID"
    })
  }
  if (request.body.displayName.length < MINIMUM_DISPLAY_NAME_LENGTH || request.body.displayName.length > MAXIMUM_DISPLAY_NAME_LENGTH){
    return response.status(401).json({
      error: "displayName is invalid length"
    })
  }
  const newUser = await dbpool.query(`INSERT INTO "users" (displayName, auth0_id) VALUES ($1, $2)`, [request.body.displayName, request.body.auth0ID])
  response.json({ "displayName": response.body.displayName, "auth0ID": response.body.auth0ID })
})

usersRouter.patch("/", auth0Service.validateAccessToken, async (request, response) => {
  const userSub = request.auth.payload.sub
  let changes = {}
  if (typeof request.body.nickname !== "undefined"){
    changes["nickname"] = request.body.nickname
  } 
  if (typeof request.body.picture !== "undefined"){
    let picture = request.body.picture.replace(/\s/g, '')
    if(picture.length > 0){
      changes["picture"] = request.body.picture
    }
  }
  const auth0Response = await auth0Service.patchUser({ "patchBody": changes, "userSub": userSub })
  return response.status(200).json(auth0Response)
})

usersRouter.get("/possibleAvatars/:query", async (request, response) => {
  const search = request.params.query
  if (typeof search === "undefined" || search === ""){
    return response.status(400).json({
      error: "need query after /possibleAvatars/"
    })
  } 
  const spotifyResponse = await spotifyService.search({ "query": search, "type": "artist", "limit": POSSIBLE_AVATARS_TO_RETURN })
  //console.log("response: ", spotifyResponse)
  if (spotifyResponse.length === 0){
    return response.status(204)
  }
  else {
    const artists = spotifyResponse
    possiblePics = []
    artists.forEach((artist) => {
      if(artist.images.length > 0){
        if(artist.images.length <= 2){
          possiblePics.push(artist.images[0].url)
        }
        else {
          possiblePics.push(artist.images[2].url)
        }
      }
    })
    return response.status(200).json(possiblePics)
  }
})



module.exports = usersRouter