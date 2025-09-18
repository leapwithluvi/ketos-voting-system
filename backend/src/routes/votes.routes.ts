import express from 'express';
import { voteCandidate } from '../controllers/vote.controllers';

const router = express.Router();

router.post('/',  voteCandidate);

export default router;
