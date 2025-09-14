import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: "postgres",
  password: process.env.PGPASSWORD,
  host: "localhost",
  port: 5432,
  database: "node_postgres",
});

export default pool;
