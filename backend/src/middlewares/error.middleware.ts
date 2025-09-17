import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!err) {
    next();
    return;
  }

  const isDev = process.env.NODE_ENV !== 'production';

  // Handle custom response errors
  if (err.isResponseError && err.status) {
    const response: any = {
      success: false,
      message: err.message,
    };
    
    if (err.data && typeof err.data === 'object' && err.data.errors) {
      response.errors = err.data.errors;
    }

    return res.status(err.status).json(response);
  }
  
  // Handle validation errors
  if (err.isValidationError && err.errors) {
    return res.status(422).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  
  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    console.error('PRISMA ERROR', {
      code: err.code,
      message: err.message,
      meta: err.meta,
    });
    
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      error: err.message,
    });
  }
  
  // Handle general errors
  console.error('ERROR', {
    name: err.name,
    message: err.message,
    ...(isDev && { stack: err.stack }),
  });

  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: err.message,
    ...(isDev && { errorFull: err.stack }),
  });
}
