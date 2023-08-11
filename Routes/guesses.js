import express from 'express';
import { getGuess, getCoins, addGuess, updateCoin } from '../Controllers/guess.js';

const router = express.Router();

router.get("/", getGuess);
router.get("/coins", getCoins);
router.post("/", addGuess);
router.put("/coins", updateCoin)

export default router;
