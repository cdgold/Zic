const http = require("http")
const express = require("express")
const app = express()
const cors = require("cors")
const usersRouter = require("./controllers/users")

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("MONGODB_URI is: ", config.MONGODB_URI)
    logger.error("error connecting to MongoDB:", error.message)
  })

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use("/api/users", usersRouter)

module.exports = app