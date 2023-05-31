const bcrypt = require("bcrypt")
const dbpool = require("../utils/databaseConfig.js")
const albumRatingsRouter = require("express").Router()

albumRatingsRouter.get("/", async (request, response) => {
  const ratings = await dbpool.query(`SELECT * FROM album_ratings`)

  response.json(ratings.rows)
})

// ratings require userID and albumID
albumRatingsRouter.get("/:userID/:albumID", async (request, response) => {
  const userID = request.params.userID
  const albumID = request.params.albumID
  const albumRating = await dbpool.query(`SELECT * FROM album_ratings WHERE user_id = $1 AND album_id = $2`, [userID, albumID])
  albumRating.rowCount === 0 ? response.status(204).end() : response.status(200).json(albumRating.rows)
})
  

// request.body required parameters: user_id, album_id, review (which could contain rating (1-100), reviewText, listenList fields)

albumRatingsRouter.post("/", async (request, response) => {
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
    insertedRow = await dbpool.query(`INSERT INTO "album_ratings" (user_id, album_id, listen_list) VALUES ($1, $2, $3)`, requestValues)
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
    insertedRow = await dbpool.query(`INSERT INTO "album_ratings" (user_id, album_id, rating, review_text,
        listen_list) VALUES ($1, $2, $3, $4, $5)`, requestValues)
  }
  return response.status(200).json(insertedRow)
})

module.exports = albumRatingsRouter