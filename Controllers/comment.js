import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

//! Get Comments
export const getComments = (req, res) => {
  const q = `SELECT c.*, u.username AS username, u.profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
             WHERE c.selpostId = ? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.selpostId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//! Save Comments
export const addComments = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments (`desc`, `userId`, `createdAt`, `selpostId`) VALUES (?)";

    const values = [
      req.body.desc,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.selpostId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comments has been created!");
    });
  });
};
