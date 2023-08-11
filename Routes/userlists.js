import express from "express";
import {
  getUserInChat,
  getUserList,
  updateUserSubscription,
  updateStatus,
  updateUserInChat,
  getUserSubscription,
  updateUserLanguage,
  getUserLangugae,
} from "../Controllers/userlist.js";

const router = express.Router();

router.get("/users", getUserList);
router.get("/users/get-user-in-chat", getUserInChat);
router.get("/users/get-user-subscription", getUserSubscription);
router.get("/users/get-user-language", getUserLangugae);
router.put("/users/status", updateStatus);
router.put("/users/user-in-chat", updateUserInChat);
router.put("/users/update-subscription", updateUserSubscription);
router.put("/users/update-language", updateUserLanguage);

export default router;
