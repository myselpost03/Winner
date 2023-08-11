import express from "express";
import { getUsernameSuggestions, searchUsernames } from "../Controllers/search.js";

const router = express.Router();

router.post("/search", searchUsernames);
router.post("/suggestions", getUsernameSuggestions );



export default router;
