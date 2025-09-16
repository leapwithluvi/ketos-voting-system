import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { responseError } from '../utils/responseTemplate';
import httpStatus from '../lib/httpStatus';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // ambil semua message error
    const extractedErrors = errors.array().map((err) => err.msg);
    return responseError(res, extractedErrors.join(', '), httpStatus.BAD_REQUEST, undefined);
  }

  next();
};
