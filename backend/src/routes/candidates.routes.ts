import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
    res.send('Ini halaman post candidates (hanya admin) ')
})
router.get('/', (req, res) => {
    res.send('Ini halaman get candidates (admin da user bisa liat) ')
})
router.patch('/:id', (req, res) => {
    res.send('Ini halaman update/patch candidates (hanya admin) ')
})
router.delete('/:id', (req, res) => {
    res.send('Ini delete candidates (hanya admin) ')
})

export default router;