import { db } from "../connect.js";
import jwt from "jsonwebtoken";
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
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO relationships (`supporterUserId`,`supportedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      const selectQ = `
        SELECT u.subscription, u.username, (
          SELECT r.supporterUserId
          FROM relationships r
          WHERE u.id = r.supportedUserId
          LIMIT 1
        ) AS supporterUserId
        FROM users u
        WHERE u.id = ?
        GROUP BY u.subscription, u.username
      `;

      const supporter = req.body.userId;
      const selectValues = [supporter];

      db.query(selectQ, selectValues, (err, selectData) => {
        if (err) {
          console.error("Error executing select query:", err);
          return res.status(500).json({ error: "An error occurred" });
        }

        const selectNewQ = `SELECT username FROM users WHERE id = ?`;

        db.query(selectNewQ, [supporter], (err, usernameData) => {
          if (err) {
            console.error("Error executing select query:", err);
            return res.status(500).json({ error: "An error occurred" });
          }

          const subscriptions = selectData.map((row) => row.subscription);
          const username = usernameData[0]?.username || "Unknown User";

          const payload = JSON.stringify({
            title: "MySelpost",
            body: "Someon supporting you",
            customTitle: "MySelpost",
            customBody: `${username} started supporting you`,
          });

          subscriptions.forEach((subscription) => {
            webPush.sendNotification(subscription, payload).catch((err) => {
              //console.error(err);
            });
          });

          return res.status(200).json("Selpost notification has been successfully!!");
        });
      });
    });
  });
};


//! Delete relationships
export const deleteRelationships = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.headers.authorization?.split(" ")[1];
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
