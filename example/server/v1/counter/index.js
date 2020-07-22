import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    count: 5
  })
})

export default router
