import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import dotenv from "dotenv";

dotenv.config();

//! Get fires
export const getFires = (req, res) => {
  const q = "SELECT userId FROM fires WHERE selpostId = ?";

  db.query(q, [req.query.selpostId, req.body.color], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((fire) => fire.userId));
  });
};

//! Save fires
export const addFire = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO fires (`userId`,`selpostId`, `color`, `timestamp`) VALUES (?)";
    const values = [userInfo.id, req.body.selpostId, req.body.color, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Selpost has been fired.");
    });
  });
};

//! Delete fires
export const deleteFire = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM fires WHERE `userId` = ? AND `selpostId` = ?";

    db.query(q, [userInfo.id, req.query.selpostId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Selpost has been unfired.");
    });
  });
};
