import express from "express";
import {
  getNotifications,
  addNotifications,
  updateMessageSubscription
} from "../Controllers/notification.js";


const router = express.Router();

router.get("/", getNotifications);
router.post("/", addNotifications);
router.put("/update-msg-subscription", updateMessageSubscription);

export default router;
