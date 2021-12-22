import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createAppointment } from '../../services/appointment'
import validationMiddleware from '../../middlewares/validation.middleware'
import BadRequestError from '../../utils/errors/bad-request-error'

const router = express.Router()

router.post(
  '/',
  [
    body('doctorId').trim().notEmpty().withMessage('Doctor ID missing'),
    body('patientId').trim().notEmpty().withMessage('Patient ID missing'),
    body('date').trim().notEmpty().withMessage('Date missing'),
    body('time').trim().notEmpty().withMessage('Time missing'),
    validationMiddleware,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const appointment = await createAppointment(req.body)
      res.status(201).json({ message: 'appointment created', appointment })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

export default router
