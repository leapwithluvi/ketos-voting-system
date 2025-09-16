import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
    res.send('Ini vote (hanya yang udah login)')
})


export default router;