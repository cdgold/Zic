const bcrypt = require("bcrypt")
const dbpool = require("../utils/databaseConfig.js")
const songRatingsRouter = require("express").Router()
const { validateAccessToken } = require("../services/auth0.js");

songRatingsRouter.get("/", async (request, response) => {
  const ratings = await dbpool.query(`SELECT * FROM song_ratings`)

  response.json(ratings.rows)
})

songRatingsRouter.get("/:userID/:songID", async (request, response) => {
  const userID = request.params.userID
  const songID = request.params.songID
  const albumRating = await dbpool.query(`SELECT * FROM song_ratings WHERE song_id = $1 AND auth0_id = $2`, [songID, userID])
  albumRating.rowCount === 0 ? response.status(204).end() : response.status(200).json(albumRating.rows[0])
})
  

// request.body required parameters: userID, songID, review (which could contain rating (1-100), reviewText, listenList fields)
/*
songRatingsRouter.post("/", validateAccessToken, async (request, response) => {
  const userID = request.body.userID
  const albumID = request.body.albumID
  const review = request.body.review

  if (typeof request.body.userID === "undefined"){
    return response.status(401).json({
      error: "need userID to rate album"
    })
  }
  if (typeof request.body.albumID === "undefined"){
    return response.status(401).json({
      error: "need albumID to rate album"
    })
  }
  if (typeof request.body.review === "undefined"){
    return response.status(401).json({
      error: "need review to rate album (preferrably with review.rating, review.reviewText and review.listenList fields)"
    })
  }
  let insertedRow
  if (typeof review.listenList !== "undefined" && review.listenList === true){
    const requestValues = [userID, albumID, true]
    insertedRow = await dbpool.query(`INSERT INTO "album_ratings" (auth0_id, album_id, listen_list) VALUES ($1, $2, $3)`, requestValues)
  }
  else{
    let newReview = {}
    typeof review.rating !== "undefined" && isNaN(review.rating) && review.rating < 0 && review.rating > 100 ?    // rating must be between 1 and 100
      newReview["rating"] = null 
      : newReview["rating"] = review.rating
    typeof review.reviewText !== "undefined" && (typeof review.reviewText === 'string' || review.reviewText instanceof String) ?   
      newReview["reviewText"] = review.reviewText
      : newReview["reviewText"] = null
    newReview["listenList"] = false
    const requestValues = [userID, albumID, newReview["rating"], newReview["reviewText"], newReview["listenList"]]
    insertedRow = await dbpool.query(`INSERT INTO "album_ratings" (auth0_id, album_id, rating, review_text,
        listen_list) VALUES ($1, $2, $3, $4, $5)`, requestValues)
  }
  return response.status(200).json(insertedRow)
})
*/
module.exports = songRatingsRouter