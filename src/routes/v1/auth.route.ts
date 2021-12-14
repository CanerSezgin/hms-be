import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createUser } from '../../services/user'
import { UserAttrs } from '../../models/User'
import validationMiddleware from '../../middlewares/validation.middleware'

const router = express.Router()

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
    body('name').trim().notEmpty().withMessage('You must supply a name'),
    body('surname').trim().notEmpty().withMessage('You must supply a surname'),
    body('userType')
      .isNumeric()
      .notEmpty()
      .withMessage('You must supply a type (number)'),
    validationMiddleware,
  ],
  async (req: Request, res: Response, next: NextFunction) => {

    try {
      console.log(req.body)
      const user = await createUser(req.body)
      res.status(201).json({ message: 'user created', user })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

export default router
