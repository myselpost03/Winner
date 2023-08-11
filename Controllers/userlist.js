import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//! Get users list
export const getUserList = (req, res) => {
  try {
    const q = `
  SELECT u.id, u.username, u.profilePic, u.status, c.message, c.createdAt
  FROM users u
  LEFT JOIN (
      SELECT MAX(id) AS maxId, userId
      FROM chats
      GROUP BY userId
  ) c1 ON u.id = c1.userId
  LEFT JOIN chats c ON c.id = c1.maxId
  ORDER BY c.createdAt DESC
`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  } catch (err) {
    //return res.status(500).json(err);
  }
};

//! Update status
export const updateStatus = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE users SET `status` = ? WHERE id = ?";

    db.query(q, [req.body.status, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data && data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can update only your status!");
    });
  });
};

//! Update user in chat value
export const updateUserInChat = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE users SET userInChat = ? WHERE id = ?";

    db.query(q, [req.body.userInChat, userInfo.id], (err, data) => {
      if (err) res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can update only your status!");
    });
  });
};

//! Get user in chat value
export const getUserInChat = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT userInChat FROM users WHERE username = ?";

    db.query(q, [req.query.username], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.length > 0) {
        const userInChat = data[0].userInChat;
        return res.json({ userInChat });
      }

      return res.status(404).json("User not found!");
    });
  });
};

//! Save user subscription
export const updateUserSubscription = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE users SET subscription = ? WHERE id = ?";

    const values = [JSON.stringify(req.body.subscription), userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json("Error occurred while saving user subscription.");
      }
      return res.status(200).json("User subscription saved successfully.");
    });
  });
};

//! Get user subscription
export const getUserSubscription = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT subscription FROM users WHERE username = ?";

    db.query(q, [req.query.username], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.length > 0) {
        const subscription = data[0].subscription;
        return res.json({ subscription });
      }

      return res.status(404).json("User subscription not found!");
    });
  });
};

//! Update user language
export const updateUserLanguage = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE users SET language = ? WHERE id = ?";

    db.query(q, [req.body.language, userInfo.id], (err, data) => {
      if (err) res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can update only your language!");
    });
  });
};

//! Get user language
export const getUserLangugae = (req, res) => {
 

    const q = "SELECT language FROM users WHERE username = ?";

    db.query(q, [req.query.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length > 0) {
        const language = data[0].language;
        return res.json({ language });
      }
      return res.status(404).json("User not found!");
    });

};
