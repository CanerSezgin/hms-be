import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createTestType } from '../../services/test'
import validationMiddleware from '../../middlewares/validation.middleware'
import BadRequestError from '../../utils/errors/bad-request-error'
import { Password } from '../../utils/password'
import { userJwt } from '../../utils/jwt'

const router = express.Router()

router.post(
  '/type',
  [
    body('type').notEmpty(),
    body('name').trim().notEmpty().withMessage('You must supply a name'),
    body('fee').notEmpty().isNumeric().withMessage('Fee should be numeric'),
    validationMiddleware,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const testType = await createTestType(req.body)
      res.status(201).json({ message: 'test type created', testType })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

export default router
