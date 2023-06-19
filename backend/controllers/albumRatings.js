const bcrypt = require("bcrypt")
const dbpool = require("../utils/databaseConfig.js")
const albumRatingsRouter = require("express").Router()
const { validateAccessToken, dropStartOfSub } = require("../services/auth0.js");
const { DatabaseError } = require("../utils/errors.js")

albumRatingsRouter.get("/", async (request, response) => {
  const ratings = await dbpool.query(`SELECT * FROM album_ratings`)

  response.json(ratings.rows)
})

// returns all album ratings of a user
albumRatingsRouter.get("/user/:auth0ID", async (request, response) => {
  const userID = request.params.auth0ID
  //console.log("User id is: ", userID)
  const albumRatings = await dbpool.query(`SELECT * FROM album_ratings WHERE auth0_id = $1`, [userID])
  //console.log("albumRatingReturn is: ", albumRatings.rows)
  albumRatings.rowCount === 0 ? response.status(204).end() : response.status(200).json(albumRatings.rows)
})
  

// returns album w/ track ratings
albumRatingsRouter.get("/:userID/:albumID", async (request, response) => {
  const userID = request.params.userID
  const albumID = request.params.albumID
  const albumRating = await dbpool.query(`SELECT * FROM album_ratings WHERE auth0_id = $1 AND album_id = $2`, [userID, albumID])
  const songRatings = await dbpool.query(`SELECT songs.song_id, song_ratings.rating 
    FROM songs
    INNER JOIN song_ratings
    ON songs.song_id = song_ratings.song_id
    WHERE songs.album_id = $1`,  
  [albumID])
  const foundRatings = {"album": albumRating.rows[0], "tracks": songRatings.rows}
  albumRating.rowCount === 0 ? response.status(204).end() : response.status(200).json(foundRatings)
})


// request.body required parameters: userID, albumID, review (which could contain rating (1-100), reviewText, listenList, listened fields)
// trackRatings is an array of tracks, made up of [id, rating]

albumRatingsRouter.post("/", validateAccessToken, async (request, response, next) => {
  let userID = request.auth.payload.sub
  userID = dropStartOfSub(userID)
  const albumID = request.body.albumID
  const review = request.body.review

  if (typeof request.body.userID === "undefined"){
    return response.status(400).json({
      error: "need userID to rate album"
    })
  }
  if (typeof request.body.albumID === "undefined"){
    return response.status(400).json({
      error: "need albumID to rate album"
    })
  }
  if (typeof request.body.review === "undefined"){
    return response.status(400).json({
      error: "need review to rate album (preferrably with review.rating, review.reviewText and review.listenList fields)"
    })
  }
  try{
    let newReview = {}
    if(typeof review.rating !== "undefined" && !(isNaN(review.rating)) 
    && review.rating >= 0 && review.rating <= 100 && review.rating !== ""){    // rating must be between 1 and 100
      newReview["rating"] = review.rating
    } else {
      newReview["rating"] = null
    }
    typeof review.reviewText !== "undefined" && (typeof review.reviewText === 'string' || review.reviewText instanceof String) ?   
      newReview["reviewText"] = review.reviewText
      : newReview["reviewText"] = null
    typeof review.listenList !== "undefined" && review.listenList === true ?   
      newReview["listenList"] = true
      : newReview["listenList"] = false
    typeof review.listened !== "undefined" && review.listened === true ?   
      newReview["listened"] = true
      : newReview["listened"] = false
    const requestValues = [userID, albumID, newReview["rating"], newReview["reviewText"], newReview["listenList"], newReview["listened"], new Date()]
    console.log("request values is: ", requestValues)
    await dbpool.query(`INSERT INTO "album_ratings" (auth0_id, album_id, rating, review_text,
        listen_list, listened, post_time) VALUES ($1, $2, $3, $4, $5, $6, $7)`, requestValues)
    const insertedAlbumResponse = await dbpool.query(`SELECT (auth0_id, album_id, rating, review_text,
      listen_list, listened, post_time) FROM "album_ratings"`)
    const insertedRows = {"album": insertedAlbumResponse.rows[0]}
    let trackRatingResponses = []
    if (typeof request.body.trackRatings !== "undefined"){
      for (const track in request.body.trackRatings) {
        if(typeof track.id !== "undefined" && typeof track.rating !== "undefined" && !(isNaN(track.rating))
        && track.rating > 0 && track.rating > 100 && track.rating !== ""){
          let songQuery = await dbpool.query(`SELECT (song_id, album_id) FROM "songs" WHERE song_id = $1`, [track.id])
          if (songQuery.rowCount == 0){
            await dbpool.query(`INSERT INTO "songs" (song_id, album_id) VALUES ($1, $2)`, [track.id, albumID])
          }
          const trackValues = [userID, track.id, track.rating]
          const insertedTrack = await dbpool.query(`INSERT INTO "song_ratings" (auth0_id, song_id, rating) VALUES ($1, $2, $3)`, trackValues)
          trackRatingResponses.push[track]
          console.log("insertedTrack is: ", insertedTrack)
        }
      }
      insertedRows["tracks"] = trackRatingResponses  
    }
    return response.status(200).json(insertedRows)
  } catch (error) {
    next(error)
  }

})

module.exports = albumRatingsRouter