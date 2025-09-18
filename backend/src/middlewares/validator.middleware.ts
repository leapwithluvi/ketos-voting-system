import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { deleteFile } from '../utils/helpers/fileDelete.helper';
import { UPLOAD_PATHS } from '../consts/const';
import path from 'path';

interface ErrorType {
  path: string;
  msg: string;
}

export const validationHandler = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files) {
      Object.values(files).forEach((arr) => {
        arr.forEach((file) => {
          const filePath = path.join(UPLOAD_PATHS.IMAGES, file.filename);
          deleteFile(filePath);
        });
      });
    }

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
