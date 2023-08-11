import express from 'express';
import {getSelposts, addSelpost} from '../Controllers/selpost.js';

const router = express.Router();

router.get("/", getSelposts)
router.post("/", addSelpost)

export default router;
