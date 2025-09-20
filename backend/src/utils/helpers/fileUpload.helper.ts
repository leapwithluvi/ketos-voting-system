import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';
import { MAX_FILE_SIZE_5MB, ALLOWED_IMAGE_TYPES, UPLOAD_PATHS } from '../../consts/const';

export const uploadFile = (
  allowedTypes: string[] = ALLOWED_IMAGE_TYPES,
  destinationPath: string = UPLOAD_PATHS.IMAGES,
  maxSize: number = MAX_FILE_SIZE_5MB,
) => {
  const fullPath = path.join(__dirname, '../../../public', destinationPath);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, fullPath);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, extension).replace(/\s+/g, '-');
      cb(null, `${baseName}-${uniqueSuffix}${extension}`);
    },
  });

  const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  };

  return multer({ storage, fileFilter, limits: { fileSize: maxSize } });
};
