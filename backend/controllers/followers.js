const { auth } = require("express-oauth2-jwt-bearer");
const { validateAccessToken } = require("../services/auth0")

const followersRouter = require("express").Router()

followersRouter.get("/followers/:userID", async (request, response) => {
    const userID = request.params.userID
    const followersResponse = await dbpool.query(`SELECT (id_being_followed) 
    FROM following
    WHERE follower_id = $1`, [userID])
    followersResponse.rowCount === 0 ? followersResponse.status(204).end() : followersResponse.status(200).json(followersResponse.rows)
})

followersRouter.get("/following/:userID", async (request, response) => {
    const userID = request.params.userID
    const followingResponse = await dbpool.query(`SELECT (follower_id) 
    FROM following
    WHERE id_being_followed = $1`, [userID])
    followingResponse.rowCount === 0 ? response.status(204).end() : response.status(200).json(followingResponse.rows)
})

followersRouter.post("/", validateAccessToken, async (request, response) => {
    const auth = request.auth
    console.log(auth.payload)
    if (typeof request.body.followingID === "undefined" || typeof request.body.followerID === "undefined"){
        return response.status(401).json({
            error: "need a followingID and a followerID"
        })
    }
    const followingID = request.body.followingID
    const followerID = request.body.followerID
  await dbpool.query(`INSERT INTO following (follower_id, id_being_followed) VALUES ($1, $2) 
    FROM following`, [followerID, followingID])
  response
    .status(200)
    .send({ following: followingID, follower: followerID })
})

followersRouter.delete("/", async (request, response) => {
    if (typeof request.body.followingID === "undefined" || typeof request.body.followerID === "undefined"){
        return response.status(401).json({
            error: "need a followingID and a followerID"
        })
    }
    const followingID = request.body.followingID
    const followerID = request.body.followerID
  await dbpool.query(`DELETE FROM following (follower_id, following_id) VALUES ($1, $2) 
    FROM following
    WHERE id_being_followed = $1`, [followerID, followingID])
  response
    .status(200)
    .send({ following: followingID, follower: followerID })
})

module.exports = loginRouter