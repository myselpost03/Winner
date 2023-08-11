import express from "express";
import { getUser, updateUser, deleteUser } from "../Controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.delete("/delete-account", deleteUser)

export default router;
