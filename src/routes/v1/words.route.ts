import express, { Request, Response, NextFunction } from 'express'

const router = express.Router()

router.get(
  '/count',
  async (req: Request, res: Response, next: NextFunction) => {
    const { resourceValue, resourceType } = req.body

    try {
      res.status(202).json({ status: 'added_to_queue' })
    } catch (error) {
      next(error)
    }
  }
)

export default router
