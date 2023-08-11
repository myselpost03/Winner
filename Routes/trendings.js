import express from "express";
import { getTrendings } from "../Controllers/trending.js";

const router = express.Router();

router.get("/", getTrendings);


export default router;
