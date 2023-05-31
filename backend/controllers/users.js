const bcrypt = require("bcrypt")
const dbpool = require("../utils/databaseConfig.js")
const usersRouter = require("express").Router()

const MINIMUM_USERNAME_LENGTH = 4
const MAXIMUM_USERNAME_LENGTH = 16
const MINIMUM_PASSWORD_LENGTH = 4
const MAXIMUM_PASSWORD_LENGTH = 16
const SALT_ROUNDS = 10

usersRouter.get("/", async (request, response) => {
  const users = await dbpool.query(`SELECT * FROM USERS`)

  response.json(users.rows)
})

usersRouter.post("/", async (request, response) => {
  if (typeof request.body.username === "undefined" || typeof request.body.username === "undefined"){
    return response.status(401).json({
      error: "need username and password"
    })
  }
  if (request.body.username.length < MINIMUM_USERNAME_LENGTH || request.body.username.length > MAXIMUM_USERNAME_LENGTH){
    return response.status(401).json({
      error: "username is invalid length"
    })
  }
  if (request.body.password.length < MINIMUM_PASSWORD_LENGTH || request.body.password.length > MAXIMUM_PASSWORD_LENGTH){
    return response.status(401).json({
      error: "password is invalid length"
    })
  }
  const passwordHash = await bcrypt.hash(request.body.password, SALT_ROUNDS)
  const requestValues = [request.body.username, passwordHash]
  const newUser = await dbpool.query(`INSERT INTO "users" (username, password) VALUES ($1, $2)`, requestValues)
  response.json(newUser)
})

module.exports = usersRouter