import { Request, Response, NextFunction } from 'express';
import { responseError } from '../utils/responseTemplate';
import httpStatus from '../lib/httpStatus';

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

    if (digits.length === 8) {
      // DDMMYYYY → DDMMYY
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const yearShort = digits.slice(6, 8);
      password = `${day}${month}${yearShort}`;
    } else if (digits.length === 6) {
      // Sudah dalam format DDMMYY
      password = digits;
    } else {
      return responseError(res, 'Format password tidak valid', httpStatus.BAD_REQUEST, undefined);
    }

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

// LOGIN ADMIN
export const normalizeAdminLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return responseError(
        res,
        'Username dan password wajib diisi',
        httpStatus.BAD_REQUEST,
        undefined,
      );
    }

    // Hapus spasi di username
    req.body.username = username.trim();

    // Hapus spasi di password (opsional)
    req.body.password = password.trim();

    next();
  } catch (err: any) {
    return responseError(
      res,
      'Terjadi kesalahan saat memproses login admin',
      httpStatus.BAD_REQUEST,
      err,
    );
  }
};

// CEK UDAH LOGIN BELUM
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user || req.session.admin) return next();
  return responseError(res, 'Anda harus login dulu', httpStatus.UNAUTHORIZED, undefined);
};
