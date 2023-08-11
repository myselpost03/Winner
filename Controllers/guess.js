import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import dotenv from "dotenv";

dotenv.config();

//! Get guess
export const getGuess = (req, res) => {
  const userId = req.query.userId;
  const secretKey =process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT * FROM guess AS g  ORDER BY g.createdAt DESC `; 

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

//! Save guess
export const addGuess = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO guess (`title`, `hint`, `img`, `userId`, `createdAt`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.hint,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Guess has been created!");
    });
  });
};

//! Get coins
export const getCoins = (req, res) => {
  const userId = req.query.userId;
  const secretKey = process.env.SECRET_KEY
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT coins FROM guess  WHERE userId=?`; 

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

//! Update coins
export const updateCoin = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE guess SET `coins` = ? WHERE userId = ?";
    const values = [req.body.coins, userInfo.id];

    db.query(q, values, (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        const insertQ = "INSERT INTO guess (coins, userId) VALUES ( ?, ?)";
        const insertValues = [req.body.coins, userInfo.id];

        db.query(insertQ, insertValues, (err, data) => {
          if (err) return res.status(500).json(err);
          return res
            .status(200)
            .json({ message: "Coins has been created!" });
        });
      } else {
        return res
          .status(200)
          .json({ message: "Coins has been updated!" });
      }
    });
  });
};




