import { Router } from 'express';
import { logout } from '../controllers/auth.controllers';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// LOGOUT
router.post('/', isAuthenticated, logout);

export default router;
