const {
  InvalidTokenError,
  UnauthorizedError,
} = require("express-oauth2-jwt-bearer");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method)
  console.log("Path:  ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {

  if (error instanceof InvalidTokenError) {
    const message = "Bad credentials";
    response.status(error.status).json({ message });
    return;
  } else if (error instanceof UnauthorizedError) {
    const message = "Requires authentication";
    response.status(error.status).json({ message });
    return;
  } else if (error instanceof UnauthorizedError) {
    const message = "Requires authentication";
    response.status(error.status).json({ message });
    return;
  } else if (error.message.includes("duplicate key value violates")) {
    const message = "Entry already exists, update it.";
    return response.status(400).json({ message })
  } else if (error.status === "400") {
    return response.status(400).send({ error: "invalid request" })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json( { error: "token missing or invalid" } )
  }
  next(error)
}

module.exports = {requestLogger, errorHandler, unknownEndpoint}