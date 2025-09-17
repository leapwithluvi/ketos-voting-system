import { body } from 'express-validator';

export const loginValidator = [
  body('nisn')
    .notEmpty()
    .withMessage('NISN harus 9-10 digit'),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .matches(/^\d{8}$/)
    .withMessage('Password harus 8 digit, format DDMMYYYY'),
];
