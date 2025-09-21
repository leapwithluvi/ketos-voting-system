import { body } from 'express-validator';

export const candidatesValidator = [
  body('no')
    .notEmpty()
    .withMessage('No wajib diisi')
    .isNumeric()
    .withMessage('No harus berupa Numeric'),
  body('visi')
    .notEmpty()
    .withMessage('Visi wajib diisi')
    .isString()
    .withMessage('Visi harus berupa string'),
  body('misi')
    .notEmpty()
    .withMessage('Misi wajib diisi')
    .isString()
    .withMessage('Misi harus berupa string'),
  body('slogan')
    .notEmpty()
    .withMessage('Slogan wajib diisi')
    .isString()
    .withMessage('Slogan harus berupa string'),
];

export const updateCandidateValidator = [
  body('no').optional().isNumeric().withMessage('No harus berupa Numeric'),

  body('visi').optional().isString().withMessage('Visi harus berupa string'),

  body('misi').optional().isString().withMessage('Misi harus berupa string'),

  body('slogan').optional().isString().withMessage('Slogan harus berupa string'),
];
