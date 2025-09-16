import express from 'express';
import authRouter from './auth.routes';

const router = express.Router();

// AUTH (LOGIN/LOGOUT)
router.use('/auth/', authRouter);


export default router;
