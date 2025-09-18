import express from 'express';
import { authorizeRole } from '../middlewares/auth.middleware';
import {
  createCandidate,
  deleteCandidate,
  getCandidate,
  getCandidateById,
  updateCandidate,
} from '../controllers/candidate.controllers';
import {
  candidatesValidator,
  updateCandidateValidator,
} from '../validations/candidates.validation';
import { validationHandler } from '../middlewares/validator.middleware';
import { upload } from '../middlewares/uploadCandidate.middleware';

const router = express.Router();

// PUBLIC
router.get('/', getCandidate);

// PRIVATE
router.post(
  '/',
  authorizeRole(['admin']),
  upload.single('foto'),
  candidatesValidator,
  validationHandler,
  createCandidate,
);
router.get('/:id', authorizeRole(['admin']), getCandidateById);
router.patch(
  '/:id',
  authorizeRole(['admin']),
  upload.single('foto'),
  updateCandidateValidator,
  validationHandler,
  updateCandidate,
);
router.delete('/:id', authorizeRole(['admin']), deleteCandidate);

export default router;
