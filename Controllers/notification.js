import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import webPush from "web-push";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

//! VAPID keys
let vapidKeys = {
  PublicKey: process.env.PUBLIC_KEY,
  PrivateKey: process.env.PRIVATE_KEY,
};

//! VAPID details
webPush.setVapidDetails(
  "mailto:myselpost1@gmail.com",
  vapidKeys.PublicKey,
  vapidKeys.PrivateKey
);

//! Get notifications
export const getNotifications = (req, res) => {
  const { sender, receiver } = req.query;

  const q = `SELECT * FROM notifications`;

  const values = [sender, receiver];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//! Save notifications
export const addNotifications = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { sender, receiver, count, receiverInChat } = req.body;

    const q = `UPDATE notifications SET count = ? WHERE sender = ? AND receiver = ?`;
    const values = [receiverInChat === "in" ? 0 : count, sender, receiver];

    const selectQ = `
      SELECT u.subscription, MAX(n.count) AS max_count
      FROM notifications n
      LEFT JOIN chats c ON n.sender = c.sender AND n.receiver = c.receiver
      LEFT JOIN users u ON n.receiver = u.username
      WHERE n.sender = ? AND u.username = ? AND u.userInChat = 'out' AND (c.blockedUsername IS NULL OR c.blockedUsername != n.receiver)
      GROUP BY u.subscription
    `;

    const selectValues = [sender, receiver];

    db.query(selectQ, selectValues, (err, data) => {
      if (err) {
        console.error("Error executing select query:", err);
        return res.status(500).json({ error: "An error occurred" });
      }

      if (count > 0) {
        const subscriptions = data.map((row) => row.subscription);

        const pushPayload = JSON.stringify({
          title: "MySelpost",
          body: `You have a new message from ${sender}`,
        });

        const pushPromises = subscriptions.map((subscription) =>
          webPush.sendNotification(subscription, pushPayload).catch((error) => {
            console.error("Error sending push notification:", error);
            return Promise.reject(error);
          })
        );

        Promise.all(pushPromises)
          .then(() => {
            performUpdate();
          })
          .catch((error) => {
            console.error("Error sending push notifications:", error);
            return res.status(500).json({ error: "An error occurred" });
          });
      } else {
        performUpdate();
      }
    });

    function performUpdate() {
      if (sender && receiver) {
        db.query(q, values, (err, result) => {
          if (err) {
            console.error("Error executing update query:", err);
            return res.status(500).json({ error: "An error occurred" });
          }

          if (result.affectedRows === 0) {
            performInsert();
          } else {
            res.status(200).json({ message: "Notification has been updated!" });
          }
        });
      } else {
        res
          .status(200)
          .json({ message: "Notification not updated or inserted!" });
      }
    }

    function performInsert() {
      const insertQ =
        "INSERT INTO notifications (sender, receiver, count, userId, createdAt) VALUES (?, ?, ?, ?, ?)";
      const insertValues = [
        sender,
        receiver,
        count,
        userInfo.id,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      ];

      db.query(insertQ, insertValues, (err, result) => {
        if (err) {
          console.error("Error executing insert query:", err);
          return res.status(500).json({ error: "An error occurred" });
        }

        res.status(200).json({ message: "Notification has been inserted!" });
      });
    }
  });
};

//! Update subscription
export const updateMessageSubscription = (req, res) => {
  const secretKey = process.env.SECRET_KEY;
 const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `UPDATE notifications SET subscription = ? WHERE sender =?`;

    const values = [JSON.stringify(req.body.subscription), req.body.sender];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Subscription has been updated successfully!");
    });
  });
};
