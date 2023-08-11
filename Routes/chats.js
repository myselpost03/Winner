import express from 'express';
import { getChats, addChats, blockChats, getBlockedChats } from '../Controllers/chat.js';

const router = express.Router();

router.get("/", getChats);
router.post("/", addChats);
router.put("/block", blockChats);
router.get("/block", getBlockedChats);

export default router;
