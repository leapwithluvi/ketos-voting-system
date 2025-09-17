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
    };
    admin?: {
      id: string;
      username: string;
      role: string;
    };
  }
}

// USER LOGIN
export const login = async (req: Request, res: Response) => {
  const { nisn, password } = req.body;
  try {
    const user = await loginServices.login(nisn, password);
    req.session.user = {
      id: user.id,
      nisn: user.nisn,
      role: user.role,
    };

    req.user = {
      id: user.id,
      nisn: user.nisn,
      role: user.role,
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
