import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import dotenv from "dotenv";

dotenv.config();

//! Get Selpost
export const getSelposts = (req, res) => {
  const userId = req.query.userId;
  const secretKey = process.env.SECRET_KEY;

  // Retrieve the access token from localStorage
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, { clockTimestamp: Date.now() / 1000 }, (err, userInfo) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json("Token is not valid!");
    }
    const q =
      userId !== "undefined"
        ? `SELECT * FROM selposts AS s JOIN users AS u ON (u.id = s.userId) WHERE s.userId = ? ORDER BY s.createdAt DESC`
        : `SELECT s.*, u.id AS userId, u.profilePic, u.username
      FROM selposts AS s
      JOIN users AS u ON u.id = s.userId
      WHERE s.userId IN (
          SELECT supportedUserId
          FROM relationships
          WHERE supporterUserId = ? 
      )
      UNION
      SELECT s.*, u.id AS userId, u.profilePic, u.username
      FROM selposts AS s
      JOIN users AS u ON u.id = s.userId
      WHERE NOT EXISTS (
          SELECT 1
          FROM relationships
          WHERE supporterUserId = ? 
      )
      ORDER BY createdAt DESC;
      `;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

//! Save Selpost
export const addSelpost = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO selposts (`audiomsg`, `category`, `img`, `userId`, `createdAt`, `secretMsg`, `receiver`) VALUES (?)";

    const values = [
      req.body.audioMsg,
      req.body.category,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.secretMsg,
      req.body.receiver,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Selpost has been created!");
    });
  });
};
