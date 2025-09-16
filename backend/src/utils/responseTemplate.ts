import { Response } from 'express';

// Success
export const responseSuccess = <T>(res: Response, message: string, status: number, data: T) => {
  return res.status(status).json({
    message,
    status,
    data,
  });
};

// Error
export const responseError = <T>(res: Response, message: string, status: number, error: T) => {
  return res.status(status).json({
    message,
    status,
    error,
  });
};
