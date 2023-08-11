import express from "express";
import {
  getRelationships,
  addRelationships,
  deleteRelationships,
  getSupporters,
} from "../Controllers/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.get("/get-supporters", getSupporters);
router.post("/", addRelationships);
router.delete("/", deleteRelationships);

export default router;
