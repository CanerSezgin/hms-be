import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createTest, createTestType } from '../../services/test'
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

router.post(
  '/',
  [
    body('appointmentId').trim().notEmpty().withMessage('Appointment ID missing'),
    body('doctorId').trim().notEmpty().withMessage('Doctor ID missing'),
    body('patientId').trim().notEmpty().withMessage('Patient ID missing'),
    body('testTypeId').trim().notEmpty().withMessage('TestType ID missing'),
    validationMiddleware,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const test = await createTest(req.body)
      res.status(201).json({ message: 'test created', test })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

export default router
