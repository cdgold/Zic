
const { auth } = require('express-oauth2-jwt-bearer')
const app = require("./app")

const jwtCheck = auth({
  audience: `${process.env.AUTH0_AUDIENCE}`,
  issuerBaseURL: `${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
});

// enforce on all endpoints
app.use(jwtCheck);

const PORT = process.env.port || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
