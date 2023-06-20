const { auth } = require("express-oauth2-jwt-bearer");
const { validateAccessToken, dropStartOfSub, getMultipleUsersByID, trimUserResponses } = require("../services/auth0")
const dbpool = require("../utils/databaseConfig.js")
const followersRouter = require("express").Router()

const DEFAULT_AMOUNT_OF_POSTS_TO_GET = 20

//returns followers of userID
followersRouter.get("/:userID", async (request, response) => {
    const userID = request.params.userID
    const followersResponse = await dbpool.query(`SELECT (follower_id) 
    FROM following
    WHERE id_being_followed = $1`, [userID])
    
    if (followersResponse.rowCount === 0) {
        response.status(204).end() 
    } else {
        let followerRows = followersResponse.rows
        const followers = followerRows.map(row => {
            Object.keys(row)[0];
            var key = Object.keys(row)[0];
            return row[key]
        })
        response.status(200).json(followers)
    }
})

//returns users that the userID is following
followersRouter.get("/following/:userID", async (request, response) => {
    let getUsersInfo = true
    if(request.query.userInfo === "false"){
        getUsersInfo = false
      }
    const userID = request.params.userID
    const followingResponse = await dbpool.query(`SELECT (id_being_followed) 
      FROM following
      WHERE follower_id = $1`, [userID])
    if (followingResponse.rowCount === 0) {
        response.status(204).end() 
    } else {
        let followingRows = followingResponse.rows
        if (getUsersInfo){
            let usersToGet = []
            followingRows.forEach((row) => {
                usersToGet.push(row.id_being_followed)
            })
            let usersResponse = await getMultipleUsersByID({ "toGet": usersToGet })
            const trimmedResponses = trimUserResponses({ "userArray": usersResponse })
            response.status(200).json(trimmedResponses)
        } else {
            const following = followingRows.map(row => {
                Object.keys(row)[0];
                var key = Object.keys(row)[0];
                return row[key]
            })
            response.status(200).json(following)
        }
    }
})

//gets posts of users being followed
// url queries: numPosts (number of posts to return) and getUsersInfo (get info of users (not just ids), default true) 
followersRouter.get("/following/posts/:userID", async (request, response) => {
    const posts = []
    let numberToGet = DEFAULT_AMOUNT_OF_POSTS_TO_GET
    let getUsersInfo = true
    if (typeof request.query.numPosts !== "undefined"){
        numberToGet = request.query.numPosts
    }
    if(request.query.userInfo === "false"){
        getUsersInfo = false
      }
    const queryVals = [request.params.userID]
    const postResponse = await dbpool.query(`
    SELECT following.id_being_followed, album_ratings.review_text, album_ratings.rating, album_ratings.album_id, album_ratings.post_time
      FROM following
      JOIN album_ratings 
      ON album_ratings.auth0_id = following.id_being_followed 
      WHERE following.follower_id = $1
      ORDER BY post_time DESC;`, queryVals)
    //console.log("postResponse: ", postResponse.rows)
    if (postResponse.rowCount === 0){
      return response.status(204).end()
    }
    else if (getUsersInfo){
        let usersToGet = []
        postResponse.rows.forEach((row) => {
            if (!(usersToGet.includes(row.id_being_followed))){
                usersToGet.push(row.id_being_followed)
            }
        })
        const usersResponse = await getMultipleUsersByID({ "toGet": usersToGet })
        const trimmedResponses = trimUserResponses({ "userArray": usersResponse })
        response.status(200).json({ "posts": postResponse.rows, "users": trimmedResponses })
    }
    else {
      response.status(200).json({ "posts": postResponse.rows })
    }
    
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
      WHERE id_being_followed = $1 AND follower_id = $2`, [followingID, followerID])
    response
      .status(204)
      .end()
})

module.exports = followersRouter
