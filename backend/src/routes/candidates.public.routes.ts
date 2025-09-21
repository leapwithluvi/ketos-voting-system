import express from 'express';
import { getCandidate } from '../controllers/candidate.controllers';
const router = express.Router();

// PUBLIC
router.get('/', getCandidate);

export default router;
