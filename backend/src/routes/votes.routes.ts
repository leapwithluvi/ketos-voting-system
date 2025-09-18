import express from 'express';
import {
  voteCandidate,
  getAllVotesAdmin,
  getVoteByIdAdmin,
  deleteVoteAdmin,
} from '../controllers/vote.controllers';
import { authorizeRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', voteCandidate);
router.get('/', authorizeRole(['admin']), getAllVotesAdmin);
router.get('/:id', authorizeRole(['admin']), getVoteByIdAdmin);
router.delete('/:id', authorizeRole(['admin']), deleteVoteAdmin);

export default router;
