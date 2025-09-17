import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

interface ErrorType {
  path: string;
  msg: string;
}

export const validationHandler = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const resErrors = (errors.array() as ErrorType[]).map((item) => ({
      field: item.path,
      message: item.msg,
    }));

    const validationError = new Error('Validation Error');
    (validationError as any).isValidationError = true;
    (validationError as any).errors = resErrors;

    throw validationError;
  }
  next();
};
