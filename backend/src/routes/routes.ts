import express from 'express';
import authRouter from './auth.routes';
import { isAuthenticated } from '../middlewares/auth.middleware';
import logout from './logout.routes';
import candidatesRouter from './candidates.routes';
import votesRouter from './votes.routes';

const router = express.Router();

// AUTH (LOGIN(USER/ADMIN))
router.use('/auth/', authRouter);

// PRIVATE
router.use([isAuthenticated]);
router.use('/logout', logout);
router.use('/candidates', candidatesRouter);
router.use('/vote', votesRouter);

export default router;
