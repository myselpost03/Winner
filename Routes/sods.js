import express from "express";
import { getSod, getLoser } from "../Controllers/sod.js";

const router = express.Router();

router.get("/", getSod);
router.get("/", getLoser);

export default router;
