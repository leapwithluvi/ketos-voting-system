import { body } from 'express-validator';

export const loginValidator = [
  body('nisn')
    .notEmpty()
    .withMessage('NISN wajib diisi')
    .isLength({ min: 9, max: 10 })
    .withMessage('NISN harus 9-10 digit.')
    .isString()
    .withMessage('NISN harus berupa digit.'),

  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 8, max: 8 })
    .withMessage('Password harus 8 digit, format DDMMYYYY.')
    .isString()
    .withMessage('Password harus berupa digit.'),
];
