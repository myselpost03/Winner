import express from "express";
import { getSuggestions } from "../Controllers/suggestion.js";

const router = express.Router();

router.get("/", getSuggestions);

export default router;
