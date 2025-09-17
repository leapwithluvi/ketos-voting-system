import express from 'express';
import { authorizeRole } from '../middlewares/auth.middleware';

const router = express.Router();

// PUBLIC
router.get('/', (req, res) => {
  res.send('Ini halaman get candidates (admin dan user bisa liat) ');
});

// PRIVATE
  router.post('/', authorizeRole(['admin']), (req, res) => {
  res.send('Ini halaman post candidates (hanya admin) ');
});
router.patch('/:id', authorizeRole(['admin']), (req, res) => {
  res.send('Ini halaman update/patch candidates (hanya admin) ');
});
router.delete('/:id', authorizeRole(['admin']), (req, res) => {
  res.send('Ini delete candidates (hanya admin) ');
});

export default router;
