const { auth } = require("express-oauth2-jwt-bearer");
const { validateAccessToken, dropStartOfSub } = require("../services/auth0")
const dbpool = require("../utils/databaseConfig.js")
const followersRouter = require("express").Router()

//returns users that the userID is following
followersRouter.get("/following/:userID", async (request, response) => {
    const userID = request.params.userID
    const followersResponse = await dbpool.query(`SELECT (id_being_followed) 
    FROM following
    WHERE follower_id = $1`, [userID])
    followersResponse.rowCount === 0 ? response.status(204).end() : response.status(200).json(followersResponse.rows)
})

//returns followers of userID
followersRouter.get("/:userID", async (request, response) => {
    const userID = request.params.userID
    const followingResponse = await dbpool.query(`SELECT (follower_id) 
    FROM following
    WHERE id_being_followed = $1`, [userID])
    followingResponse.rowCount === 0 ? response.status(204).end() : response.status(200).json(followingResponse.rows)
})

followersRouter.post("/", validateAccessToken, async (request, response) => {
    const auth = request.auth
    if (typeof request.body.followingID === "undefined"){
        return response.status(400).json({
            error: "need a followingID"
        })
    }
    const followingID = request.body.followingID
    const followerID = dropStartOfSub(auth.payload.sub)
  await dbpool.query(`INSERT INTO following (follower_id, id_being_followed) VALUES ($1, $2)`, [followerID, followingID])
  response
    .status(200)
    .send({ following: followingID, follower: followerID })
})

followersRouter.delete("/:deleteID", validateAccessToken, async (request, response) => {
    const auth = request.auth
    const followingID = request.params.deleteID
    const followerID = dropStartOfSub(auth.payload.sub)
  await dbpool.query(`DELETE FROM following
    WHERE id_being_followed = $2 AND follower_id = $1`, [followerID, followingID])
  response
    .status(204)
    .end()
})

module.exports = followersRouter