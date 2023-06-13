const http = require("http")
const express = require("express")
const app = express()
const cors = require("cors")
const usersRouter = require("./controllers/users.js")
const albumsRouter = require("./controllers/albums.js")
const albumRatingsRouter = require("./controllers/albumRatings.js")
const songRatingsRouter = require("./controllers/songRatings.js")
const middleware = require("./utils/middleware")

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/users", usersRouter)
app.use("/api/albums", albumsRouter)
app.use("/api/albumRatings", albumRatingsRouter)
app.use("/api/songRatings", songRatingsRouter)

/*
app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, './build/')})
})
*/
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app