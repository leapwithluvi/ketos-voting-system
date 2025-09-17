import { body } from 'express-validator';

export const candidatesValidator = [
  body('nama')
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isString()
    .withMessage('Nama harus berupa string'),
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
];

export const updateCandidateValidator = [
  body('nama').optional().isString().withMessage('Nama harus berupa string'),

  body('visi').optional().isString().withMessage('Visi harus berupa string'),

  body('misi').optional().isString().withMessage('Misi harus berupa string'),
];
