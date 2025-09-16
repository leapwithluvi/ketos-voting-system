import { body } from 'express-validator';

export const loginValidator = [
  body('nisn')
    .notEmpty()
    .withMessage('NISN wajib diisi')
    .matches(/^\d{10,11}$/)
    .withMessage('NISN harus 10-11 digit'),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .matches(/^\d{6,8}$/)
    .withMessage('Password harus 6-8 digit, format DDMMYY atau DDMMYYYY'),
];

export const adminValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username wajib diisi')
    .isString()
    .withMessage('Username harus berubah string'),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({
      min: 6,
    })
    .withMessage('Password tidak boleh kurang dari 6 karakter'),
];
