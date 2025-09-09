// require("dotenv").config(); // you may need this import

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "8213", // use env variables for sensitive data (like process.env.PGPASSWORD). Also check usage of .env file
  host: "localhost",
  port: 5432,
  database: "node_postgres",
});

module.exports = pool;
