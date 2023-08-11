import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//! Get relationships
export const getRelationships = (req, res) => {
  const q =
    "SELECT supporterUserId FROM relationships WHERE supportedUserId = ?";

  db.query(q, [req.query.supportedUserId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res
      .status(200)
      .json(data.map((relationship) => relationship.supporterUserId));
  });
};

//! Get supporters
export const getSupporters = (req, res) => {
  const q = `SELECT COUNT(*) AS total_supporters
  FROM relationships
  WHERE supportedUserId = ?`;

  db.query(q, [req.query.supportedUserId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json("Error fetching total number of supporters", err);
    } else {
      const totalSupporters = results[0].total_supporters;
      return res.status(200).json(totalSupporters);
    }
  });
};

//! Save relationships
export const addRelationships = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO relationships (`supporterUserId`,`supportedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Supporting");
    });
  });
};

//! Delete relationships
export const deleteRelationships = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM relationships WHERE `supporterUserId` = ? AND `supportedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unsupport");
    });
  });
};
