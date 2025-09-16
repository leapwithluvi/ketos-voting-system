import { Router } from 'express';
import { logout } from '../controllers/auth.controllers';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { login, adminLogin } from '../controllers/auth.controllers';
import { loginValidator, adminValidator } from '../validations/login.validation';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { normalizeLogin, normalizeAdminLogin } from '../middlewares/auth.middleware';

const router = Router();

// LOGIN
router.post('/login', normalizeLogin, loginValidator, validateRequest, login);
router.post('/login/admin', normalizeAdminLogin, adminValidator, validateRequest, adminLogin);

// LOGOUT
router.post('/logout', isAuthenticated, logout);

export default router;
