import { Request, Response, NextFunction } from 'express';
import { responseError } from '../utils/responseTemplate';
import httpStatus from '../lib/httpStatus';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        nisn: string;
        role: string;
        nama: string;
      };
    }
  }
}

// LOGIN USER
export const normalizeLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    let { nisn, password } = req.body;

    if (!nisn || !password) {
      return responseError(res, 'NISN dan password wajib diisi', httpStatus.BAD_REQUEST, undefined);
    }

    // Normalisasi nisn (hapus spasi)
    nisn = nisn.replace(/\s/g, '');
    req.body.nisn = nisn;

    // Ambil angka dari password (abaikan spasi, -, /, teks bulan, dll.)
    const digits = password.replace(/\D/g, '');

    password = digits;

    req.body.password = password;
    next();
  } catch (err: any) {
    return responseError(
      res,
      'Terjadi kesalahan saat normalisasi password',
      httpStatus.BAD_REQUEST,
      err,
    );
  }
};

// CEK UDAH LOGIN BELUM
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    req.user = {
      id: req.session.user.id,
      nisn: req.session.user.nisn,
      role: req.session.user.role,
      nama: req.session.user.nama,
    };
    return next();
  }
  return responseError(res, 'Anda harus login dulu', httpStatus.UNAUTHORIZED, undefined);
};

// AUTHORIZE ROLE
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user)
      return responseError(res, 'User tidak ditemukan', httpStatus.UNAUTHORIZED, undefined);
    if (!roles.includes(user.role))
      return responseError(res, 'Access denied', httpStatus.FORBIDDEN, undefined);
    next();
  };
};
