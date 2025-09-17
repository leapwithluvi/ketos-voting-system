import { Router } from 'express';
import { login } from '../controllers/auth.controllers';
import { loginValidator } from '../validations/login.validation';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { normalizeLogin } from '../middlewares/auth.middleware';

const router = Router();

// LOGIN
router.post('/login', normalizeLogin, loginValidator, validateRequest, login);

export default router;
