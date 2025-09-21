import express from 'express';
import authRouter from './auth.routes';
import { isAuthenticated } from '../middlewares/auth.middleware';
import logout from './user.routes';
import candidatesRouter from './candidates.routes';
import votesRouter from './votes.routes';
import resultRouter from './result.routes';
import candidatesPublic from './candidates.public.routes';

const router = express.Router();

// AUTH (LOGIN(USER/ADMIN))
router.use('/auth/', authRouter);

// PUBLIC
router.use('/candidates', candidatesPublic);

// PRIVATE
router.use([isAuthenticated]);
router.use('/user', logout);
router.use('/admin/candidates', candidatesRouter);
router.use('/vote', votesRouter);
router.use('/results', resultRouter);

export default router;
