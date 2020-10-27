import express from 'express'
import counter from './counter'

const router = express.Router()

router.use('/counter', counter)

export default router
