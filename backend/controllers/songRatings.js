const bcrypt = require("bcrypt")
const dbpool = require("../utils/databaseConfig.js")
const songRatingsRouter = require("express").Router()
const { validateAccessToken } = require("../services/auth0.js");

// BUSTED, MAKE INDIVIDUAL SONG POSTS POSSIBLE, MULTIPLE POSSIBLE


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
  
songRatingsRouter.post("/", async (request, response) => {
  const userID = request.body.userID

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

  let insertedRow
  if (typeof request.body.trackRatings !== "undefined"){
    for (track of request.body.trackRatings) {
      if(typeof track.id !== "undefined" && typeof track.rating !== "undefined"){
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
  return response.status(200).json(insertedRow)
}})

module.exports = songRatingsRouter