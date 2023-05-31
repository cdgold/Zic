const http = require("http")
const express = require("express")
const app = express()
const cors = require("cors")
const usersRouter = require("./controllers/users.js")
const albumsRouter = require("./controllers/albums.js")
const albumRatingsRouter = require("./controllers/albumRatings.js")

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

app.use("/api/users", usersRouter)
app.use("/api/albums", albumsRouter)
app.use("/api/albumRatings", albumRatingsRouter)

module.exports = app