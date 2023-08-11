import express from 'express';
import { addFeedback } from '../Controllers/feedback.js';

const router = express.Router();


router.post("/", addFeedback);

export default router;
