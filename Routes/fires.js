import express from "express";
import { getFires, addFire, deleteFire } from "../Controllers/fire.js";

const router = express.Router();

router.get("/", getFires);
router.post("/", addFire);
router.delete("/", deleteFire);

export default router;
