import { Router } from 'express';
import { getCurrentUser, logout } from '../controllers/auth.controllers';

const router = Router();

// LOGOUT
router.post('/logout', logout);

// GET CURRENT USER
router.get('/me', getCurrentUser)

export default router;
