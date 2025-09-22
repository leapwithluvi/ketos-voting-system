import { Request } from 'express';

export const getFileUrl = (req: Request, filename: string, folder: string): string => {
  const host = req.get('host');
  const protocol = req.protocol || (req.headers['x-forwarded-proto'] as string) || 'http';

  return `${protocol}://${host}/public/${folder}/${filename}`;
};
