import { Request } from 'express';

export const getFileUrl = (req: Request, filename: string, folder: string): string => {
  const host = req.get('host');
  return `http://${host}/public/${folder}/${filename}`;
};
