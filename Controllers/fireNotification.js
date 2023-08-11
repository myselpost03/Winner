import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import webPush from "web-push";
import dotenv from "dotenv";

dotenv.config();

let vapidKeys = {
  PublicKey:process.env.PUBLIC_KEY,
   PrivateKey: process.env.PRIVATE_KEY,
};

webPush.setVapidDetails(
  "mailto:myselpost1@gmail.com",
  vapidKeys.PublicKey,
  vapidKeys.PrivateKey
);

export const getFireNotifications = (req, res) => {
  const q = `SELECT * FROM firenotification WHERE selpostUsername =? ORDER BY createdAt DESC LIMIT 1`;

  db.query(q, [req.query.selpostUsername], (err, data) => {
    if (err) {
      return res.status(500).json({
        error: "An error occurred while fetching fire notifications.",
      });
    }
    return res.status(200).json(data);
  });
};

export const saveFireNotification = (req, res) => {
  const secretKey =
    "sdgiuayeoqllemcsauastyuewurcllxzopXJIOSFEIJFOJDSLKJFIOIOWEJwoijeiofjklfdgjlfkdgjsopiddvm65d4962d1g3687g6d4fg4fd8dsjbVCXYXIUDJFSDLFEOIGALKDHGIODHGIUHGAfdgihdsifg2754328956f54h87dfasdgbhsjbHJBGIDUGFUEWSATEUIIUHNJK";

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const selectQuery = `SELECT * FROM firenotification WHERE userId = ? AND selpostId = ?`;
    const selectValues = [userInfo.id, req.body.selpostId];

    db.query(selectQuery, selectValues, (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length > 0) {
        return res.status(200).json("Existing row found!");
      }

      const insertQuery =
        "INSERT INTO firenotification (`userId`,`selpostId`, `count`, `username`, `selpostUsername`, `profilePic`, `createdAt`, `subscription`) VALUES (?)";
      const insertValues = [
        userInfo.id,
        req.body.selpostId,
        req.body.count,
        req.body.username,
        req.body.selpostUsername,
        req.body.profilePic,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        JSON.stringify(req.body.subscription),
      ];

      db.query(insertQuery, [insertValues], (err, data) => {
        if (err) return res.status(500).json(err);

        const selectLatestQuery = `
        SELECT subscription FROM firenotification 
        WHERE selpostUsername = '${req.body.username}' 
        ORDER BY createdAt DESC LIMIT 1
        `;

       try{ db.query(selectLatestQuery, (err, data) => {
        if (err) {
          // console.error(err);
          // return res.status(500).json(err);
        }

        const subscriptions = data.map((row) => row.subscription);
        const payload = JSON.stringify({
          title: "MySelpost",
          body: "You have a notification",
          customTitle: "MySelpost",
          customBody: `You have new notifications`,
        });
        subscriptions.forEach((subscription) => {
          webPush
            .sendNotification(subscription, payload)
            .catch((err) => {
              //console.error(err);
            });
        });
        return res.status(200).json("Selpost notification has been successfully!!");
      });
    } catch(error){
      //console.log(error
    }
      });
    });
  });
};

export const updateFireNotification = (req, res) => {
  const secretKey =
    "sdgiuayeoqllemcsauastyuewurcllxzopXJIOSFEIJFOJDSLKJFIOIOWEJwoijeiofjklfdgjlfkdgjsopiddvm65d4962d1g3687g6d4fg4fd8dsjbVCXYXIUDJFSDLFEOIGALKDHGIODHGIUHGAfdgihdsifg2754328956f54h87dfasdgbhsjbHJBGIDUGFUEWSATEUIIUHNJK";

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const selpostUsername = req.query.selpostUsername;

    const q =
      "UPDATE firenotification SET `count` = ? WHERE selpostUsername = ? ";

    db.query(q, [req.body.count, selpostUsername], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Selpost notification count has been updated successfully!");
    });
  });
};

export const updateSubscription = (req, res) => {
  const secretKey =
    "sdgiuayeoqllemcsauastyuewurcllxzopXJIOSFEIJFOJDSLKJFIOIOWEJwoijeiofjklfdgjlfkdgjsopiddvm65d4962d1g3687g6d4fg4fd8dsjbVCXYXIUDJFSDLFEOIGALKDHGIODHGIUHGAfdgihdsifg2754328956f54h87dfasdgbhsjbHJBGIDUGFUEWSATEUIIUHNJK";

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `UPDATE firenotification SET subscription = ? WHERE selpostUsername =?`;

    const values = [JSON.stringify(req.body.subscription), req.body.username];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Subscription has been updated successfully!");
    });
  });
};