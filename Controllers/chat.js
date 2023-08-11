import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import webPush from "web-push";
import dotenv from "dotenv";

dotenv.config();

let vapidKeys = {
  PublicKey: process.env.PUBLIC_KEY,
  PrivateKey: process.env.PRIVATE_KEY,
};

webPush.setVapidDetails(
  "mailto:myselpost1@gmail.com",
  vapidKeys.PublicKey,
  vapidKeys.PrivateKey
);

//! Get chats
export const getChats = (req, res) => {
  const { sender, receiver } = req.query;

  const q = `SELECT sender, receiver, message
  FROM chats
  WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)`;

  const values = [sender, receiver, receiver, sender];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//! Save chats
export const addChats = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO chats (`sender`, `userId`, `receiver`, `message`, `createdAt`) VALUES (?, ?, ?, ?, ?)";

    const values = [
      req.body.sender,
      userInfo.id,
      req.body.receiver,
      req.body.message,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Selpost notification has been created.");
    });
  });
};

//! Block chats
export const blockChats = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT * FROM chats WHERE id = ?";
    const values = [userInfo.id];

    db.query(q, values, (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0) {
        const insertQ = "INSERT INTO chats SET ?";
        const insertValues = {
          id: userInfo.id,
          blocked: req.body.blocked,
          blockedBy: req.body.blockedBy,
          blockedUsername: req.body.blockedUsername,
        };

        db.query(insertQ, insertValues, (err, insertData) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Chat has been blocked!");
        });
      } else {
        const updateQ =
          "UPDATE chats SET `blocked` = ?, `blockedUsername` = ?, `blockedBy` =? WHERE id = ?";
        const updateValues = [
          req.body.blocked,
          req.body.blockedBy,
          req.body.blockedUsername,
          userInfo.id,
        ];

        db.query(updateQ, updateValues, (err, updateData) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Chat has been blocked!");
        });
      }
    });
  });
};

//! Get blocked chats
export const getBlockedChats = (req, res) => {
  const { blockedUsername } = req.query;

  const q = `SELECT blocked, blockedUsername
    FROM chats
    WHERE (blocked =? AND blockedUsername = '${blockedUsername}') `;

  const values = ["true", blockedUsername];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


