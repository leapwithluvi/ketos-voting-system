import { Request, Response } from 'express';
import * as loginServices from '../services/login.services';
import { responseSuccess, responseError } from '../utils/responseTemplate';
import httpStatus from '../lib/httpStatus';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      nisn: string;
      role: string;
      nama: string;
    };
  }
}

// USER LOGIN
export const login = async (req: Request, res: Response) => {
  const { nisn, password } = req.body;
  try {
    const user = await loginServices.login(nisn, password);

    if (!user || !user.id || !user.nisn || !user.role || !user.nama) {
      return responseError(
        res,
        'Invalid user data received from login service.',
        httpStatus.INTERNAL_SERVER_ERROR,
        undefined,
      );
    }

    req.session.user = {
      id: user.id!,
      nisn: user.nisn,
      role: user.role,
      nama: user.nama,
    };

    req.user = {
      id: user.id,
      nisn: user.nisn,
      role: user.role,
      nama: user.nama,
    };

    return responseSuccess(res, 'Login berhasil.', httpStatus.OK, {
      id: user.id,
      nisn: user.nisn,
      role: user.role,
    });
  } catch (err: any) {
    return responseError(res, err.message || 'Login gagal.', httpStatus.BAD_REQUEST, err);
  }
};

// LOGOUT
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return responseError(res, 'Gagal logout', httpStatus.INTERNAL_SERVER_ERROR, err);
    res.clearCookie('sid');
    return responseSuccess(res, 'Logout berhasil', httpStatus.OK, undefined);
  });
};

// USER GET CURRENT
export const getCurrentUser = (req: Request, res: Response) => {
  const user = req.session.user;

  if (!user) {
    return responseError(res, 'User tidak login', 401, undefined);
  }

  return responseSuccess(res, 'Current user', 200, user);
};
