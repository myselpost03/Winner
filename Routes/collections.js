import express from 'express';
import {getCollections} from '../Controllers/collection.js';

const router = express.Router();

router.get("/", getCollections)

export default router;
