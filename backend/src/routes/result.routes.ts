import { Router } from 'express';
import { getResults } from '../controllers/result.controllers';
import { authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// Admin-only endpoint untuk ambil hasil voting real-time
router.get('/', authorizeRole(['admin']), getResults);

export default router;
