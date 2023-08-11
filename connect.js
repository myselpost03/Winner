import mysql2 from "mysql2"
import dotenv from "dotenv";

dotenv.config()

export const db = mysql2.createPool({
  connectionLimit: 100,
  host:process.env.HOST,
  user:process.env.USER,
  password:process.env.PASSWORD,
  database:process.env.DATABASE,
  port:process.env.DB_PORT,
  waitForConnections: true,
  queueLimit: 0,
})

//! Connect to the database
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }

  console.log("Connected to database!");
  connection.release();
});
