const bcrypt = require("bcrypt")
const dbpool = require("../utils/databaseConfig.js")
const songRatingsRouter = require("express").Router()
const { validateAccessToken, dropStartOfSub } = require("../services/auth0.js");

// BUSTED, MAKE INDIVIDUAL SONG POSTS POSSIBLE, MULTIPLE POSSIBLE


songRatingsRouter.get("/", async (request, response) => {
  const ratings = await dbpool.query(`SELECT * FROM song_ratings`)

  response.json(ratings.rows)
})

songRatingsRouter.get("/:userID/:songID", async (request, response) => {
  const userID = request.params.userID
  const songID = request.params.songID
  const songRating = await dbpool.query(`SELECT * FROM song_ratings WHERE song_id = $1 AND auth0_id = $2`, [songID, userID])
  songRating.rowCount === 0 ? response.status(204).end() : response.status(200).json(songRating.rows[0])
})
  
// post multiple song ratings from same album
songRatingsRouter.post("/album", validateAccessToken, async (request, response) => {
  let userID = request.auth.payload.sub
  userID = dropStartOfSub(userID)
  if (typeof request.body.trackRatings === "undefined" || typeof request.body.albumID === "undefined"){
    return response.status(400).json({
      error: "need trackRatings and albumID to post to this URL."
    })
  }
  const trackRatings = request.body.trackRatings
  const albumID = request.body.albumID
  let insertedRows = []
    for ([trackID, rating] of Object.entries(trackRatings)) {
        if (!(isNaN(rating)) && rating !== "" && rating <= 100 && rating >= 0){
                let songQuery = await dbpool.query(`SELECT (song_id, album_id) FROM "songs" WHERE song_id = $1`, [trackID])
                if (songQuery.rowCount == 0){
                    await dbpool.query(`INSERT INTO "songs" (song_id, album_id) VALUES ($1, $2)`, [trackID, albumID])
                }
                const trackValues = [userID, trackID, rating]
                await dbpool.query(`INSERT INTO "song_ratings" (auth0_id, song_id, rating) VALUES ($1, $2, $3)`, trackValues)
                const newlyCreatedRating = await dbpool.query(`SELECT FROM "song_ratings" WHERE auth0_id = $1 AND song_id = $2`, [userID, trackID])
                insertedRows.push[newlyCreatedRating.rows[0]]
            }
        }
  return response.status(200).json(insertedRows)
})

module.exports = songRatingsRouter