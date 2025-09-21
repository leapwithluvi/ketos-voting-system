import express from 'express';
import { authorizeRole } from '../middlewares/auth.middleware';
import {
  createCandidate,
  deleteCandidate,
  getCandidateById,
  updateCandidate,
} from '../controllers/candidate.controllers';
import {
  candidatesValidator,
  updateCandidateValidator,
} from '../validations/candidates.validation';
import { validationHandler } from '../middlewares/validator.middleware';
import { upload } from '../middlewares/uploadCandidate.middleware';
import { getCandidate } from '../services/candidate.services';

const router = express.Router();

// PRIVATE
router.post(
  '/',
  authorizeRole(['admin']),
  upload.fields([
    { name: 'ketuaImg', maxCount: 1 },
    { name: 'wakilImg', maxCount: 1 },
    { name: 'jurusanImg', maxCount: 2 },
  ]),
  candidatesValidator,
  validationHandler,
  createCandidate,
);
// GET all candidates (admin)
router.get('/', authorizeRole(['admin']), getCandidate);

router.get('/:id', authorizeRole(['admin']), getCandidateById);
router.patch(
  '/:id',
  authorizeRole(['admin']),
  upload.fields([
    { name: 'ketuaImg', maxCount: 1 },
    { name: 'wakilImg', maxCount: 1 },
    { name: 'jurusanImg', maxCount: 2 },
  ]),
  updateCandidateValidator,
  validationHandler,
  updateCandidate,
);
router.delete('/:id', authorizeRole(['admin']), deleteCandidate);

export default router;
