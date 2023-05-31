const dbpool = require("../utils/databaseConfig.js")
const albumsRouter = require("express").Router()

albumsRouter.get("/", async (request, response) => {
  const albums = await dbpool.query(`SELECT * FROM albums`)

  response.json(albums.rows)
})

albumsRouter.get("/:id", async (request, response) => {
  const albumID = request.params.id
  const album = await dbpool.query(`SELECT * FROM albums WHERE album_id = $1`, [albumID])
  console.log("album is: ", album)
  album.rowCount === 0 ? response.status(204).end() : response.status(200).json(album.rows)
})
  

// request.body required parameters: artist, title, albumID (Spotify ID)

albumsRouter.post("/", async (request, response) => {
  if (typeof request.body.artistName === "undefined" || typeof request.body.title === "undefined" || typeof request.body.albumID === "undefined"){
    return response.status(401).json({
      error: "album creation requires artistName, title, and albumID"
    })
  }

  const requestValues = [request.body.albumID, request.body.title, request.body.artistName]

  await dbpool.query(`INSERT INTO albums (album_id, title, artist_name) VALUES ($1, $2, $3)`, requestValues)
  const newAlbum = await dbpool.query(`SELECT * FROM albums WHERE album_id = $1`, [requestValues[0]])
  return response.status(200).json(newAlbum)
})

module.exports = albumsRouter