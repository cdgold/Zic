
const app = require("./app")

const PORT = process.env.port || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
