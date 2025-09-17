import { Router } from 'express';
import { login } from '../controllers/auth.controllers';
import { loginValidator } from '../validations/login.validation';
import { validationHandler } from '../middlewares/validator.middleware';
import { normalizeLogin } from '../middlewares/auth.middleware';

const router = Router();

// LOGIN
router.post('/login', normalizeLogin, loginValidator, validationHandler, login);

export default router;
