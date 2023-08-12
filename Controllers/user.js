import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//! Get users
export const getUser = (req, res) => {
  try {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";

    db.query(q, [userId], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Error occurred" });
      }

      if (data.length > 0) {
        const { password, ...info } = data[0];
        return res.json(info);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//! Update user profile
export const updateUser = (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, secretKey, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      const q =
        "UPDATE users SET `name` =?, `gender` =?, `about` =?, `location` =?, `education` =?, `profilePic` =?, `email` =? WHERE id=?";

      db.query(
        q,
        [
          req.body.name,
          req.body.gender,
          req.body.about,
          req.body.location,
          req.body.education,
          req.body.profilePic,
          req.body.email,
          req.body.id,
        ],
        (err, data) => {
          if (err) res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Updated!");
          return res.status(403).json("You can update only your selpost!");
        }
      );
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

//! Delete user
export const deleteUser = (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, secretKey, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      const q = `DELETE FROM users WHERE username =?`;
      db.query(q, [req.query.username], (err, data) => {
        if (err) res.status(500).json(err);
      });
    });
  } catch (err) {
    //return res.status(500).json(err);
  }
};
