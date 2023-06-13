
const dbpool = require("../utils/databaseConfig.js")
const usersRouter = require("express").Router()
const axios = require("axios")
const auth0Service = require("../services/auth0.js")

const MINIMUM_DISPLAY_NAME_LENGTH = 4
const MAXIMUM_DISPLAY_NAME_LENGTH = 16

usersRouter.get("/", async (request, response) => {
  const ID = request.params.authID
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

usersRouter.get("/:authID", async (request, response) => {
  const ID = request.params.authID
  const returnUser = await auth0Service.getUser(ID)
  console.log(`response is: `, returnUser)
  response.json(returnUser)
})

usersRouter.get("/search/:query", async (request, response) => {
  const query = request.params.query
  const auth0Response = await auth0Service.searchUsersByNickname(query)
  const trimmedResponses = auth0Response.map(response => {
      const trimmedUser = {
        "nickname": response.nickname,
        "picture": response.picture,
        "userID ": auth0Service.dropStartOfSub(response.user_id)
      }
      return trimmedUser
    })
  response.json(trimmedResponses)
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



module.exports = usersRouter