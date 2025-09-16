import { Request, Response } from 'express';
import * as loginServices from '../services/login.services';
import { responseSuccess, responseError } from '../utils/responseTemplate';
import httpStatus from '../lib/httpStatus';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      nisn: string;
    };
    admin?: {
      id: string;
      username: string;
    };
  }
}

// USER LOGIN
export const login = async (req: Request, res: Response) => {
  const { nisn, password } = req.body;
  try {
    const user = await loginServices.login(nisn, password);

    // simpan session
    req.session.user = {
      id: user.id,
      nisn: user.nisn,
    };

    return responseSuccess(res, 'Login berhasil.', httpStatus.OK, {
      id: user.id,
      nisn: user.nisn,
    });
  } catch (err: any) {
    return responseError(res, err.message || 'Login gagal.', httpStatus.BAD_REQUEST, err);
  }
};

// ADMIN LOGIN
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const admin = await loginServices.loginAdmin(username, password);

    // simpan session admin
    req.session.admin = {
      id: admin.id,
      username: admin.username,
    };

    return responseSuccess(res, 'Login berhasil', httpStatus.OK, {
      id: admin.id,
      username: admin.username,
    });
  } catch (err: any) {
    return responseError(
      res,
      err.message || 'Login gagal admin',
      httpStatus.UNAUTHORIZED,
      undefined,
    );
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
