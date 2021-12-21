import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createUser, getUserByEmail } from '../../services/user'
import validationMiddleware from '../../middlewares/validation.middleware'
import BadRequestError from '../../utils/errors/bad-request-error'
import { Password } from '../../utils/password'
import { userJwt } from '../../utils/jwt'

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

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
    validationMiddleware,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
      const user = await getUserByEmail(email)
      if (!user) throw new BadRequestError('Invalid credentials')
  
      const passwordMatch = await Password.compare(user.password, password)
      if (!passwordMatch) throw new BadRequestError('Invalid credentials')
  
      const token = userJwt.generate(user.id, user.email, user.userType)
  
      res.status(200).json({user, token})
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

export default router
