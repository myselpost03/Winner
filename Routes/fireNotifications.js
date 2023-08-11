import express from "express";
import {
  getFireNotifications,
  saveFireNotification,
  updateFireNotification,
  updateSubscription
} from "../Controllers/fireNotification.js";

const router = express.Router();

router.get("/", getFireNotifications);
router.post("/", saveFireNotification);
router.put("/", updateFireNotification);
router.put("/update-subscription", updateSubscription);


export default router;
