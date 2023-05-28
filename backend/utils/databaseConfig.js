//MOVE TO .ENV!!!

import { Pool } from "pg"

const pool = new Pool({
  user: "zicmaster",
  database: "Zic",
  password: "root",
  port: 5432,
  host: "localhost",
})

export default pool