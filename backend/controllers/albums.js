const dbpool = require("../utils/databaseConfig.js")
const albumsRouter = require("express").Router()
const spotifyService = require("../services/spotify.js")

/*
albumsRouter.get("/", async (request, response) => {
  const albums = await dbpool.query(`SELECT * FROM albums`)

  response.json(albums.rows)
})
*/

// checks Spotify api (not Zic database) for query matches
albumsRouter.get("/searchSpotify/:query", async (request, response) => {
  /*
  if (typeof request.body.query === 'undefined' && (typeof request.body.query !== 'string' || request.body.query instanceof String)){
    return response.status(401).json({
      error: "search requests require a query"
    })
  }
  */
  
  const query = request.params.query
  const results = await spotifyService.search({"query": query, "type": "album"})
  return response.status(200).json(results)
})

albumsRouter.get("/:id", async (request, response) => {
  /*
  const albumID = request.params.id
  const album = await dbpool.query(`SELECT * FROM albums WHERE album_id = $1`, [albumID])
  console.log("album is: ", album)
  album.rowCount === 0 ? response.status(204).end() : response.status(200).json(album.rows)
  */
})

albumsRouter.get("/spotify/:id", async (request, response, next) => {
  const albumID = request.params.id
  try{
    const getResponse = await spotifyService.getWithID({ "type": "album", "id": albumID })
    response.status(200).json(getResponse)
  }
  catch (err) {
    return response.status(400).json({
      error: "invalid spotify id"
    })
    next(err)
  }
})

// request.body required parameters: artist, title, albumID (Spotify ID)

albumsRouter.post("/", async (request, response) => {
  if (typeof request.body.artistName === "undefined" || typeof request.body.title === "undefined" || typeof request.body.albumID === "undefined"){
    return response.status(400).json({
      error: "album creation requires artistName, title, and albumID"
    })
  }

  const requestValues = [request.body.albumID, request.body.title, request.body.artistName]

  await dbpool.query(`INSERT INTO albums (album_id, title, artist_name) VALUES ($1, $2, $3)`, requestValues)
  const newAlbum = await dbpool.query(`SELECT * FROM albums WHERE album_id = $1`, [requestValues[0]])
  return response.status(200).json(newAlbum)
})

// give array of ids to look up, returns said albums in array
albumsRouter.post("/spotify", async (request, response) => {
  const requestedAlbums = request.body

  const albums = await spotifyService.getMultipleWithID({"ids": requestedAlbums, "type": "album"})
  return response.status(200).json(albums)
})

module.exports = albumsRouter