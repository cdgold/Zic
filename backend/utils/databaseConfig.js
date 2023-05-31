//MOVE TO .ENV!!!

require('dotenv').config()
const { Pool } = require('pg')

const databasePool = new Pool({
  user: process.env.DATABASE_LOGIN,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
  host: "localhost",
})

module.exports = databasePool