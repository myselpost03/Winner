import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//! Get Selpost collection
export const getCollections = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT * FROM selposts WHERE userId =?`
  
    db.query(q, [req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

