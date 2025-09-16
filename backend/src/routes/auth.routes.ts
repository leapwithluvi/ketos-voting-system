import { Router } from 'express';
import { login, adminLogin } from '../controllers/auth.controllers';
import { loginValidator, adminValidator } from '../validations/login.validation';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { normalizeLogin, normalizeAdminLogin } from '../middlewares/auth.middleware';

const router = Router();

// LOGIN
router.post('/login', normalizeLogin, loginValidator, validateRequest, login);
router.post('/login/admin', normalizeAdminLogin, adminValidator, validateRequest, adminLogin);

export default router;
