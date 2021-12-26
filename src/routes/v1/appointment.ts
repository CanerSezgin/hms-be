import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createAppointment, getAppointment, getAppointments } from '../../services/appointment'
import validationMiddleware from '../../middlewares/validation.middleware'
import BadRequestError from '../../utils/errors/bad-request-error'

const router = express.Router()


router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: appointmentId } = req.params

    try {
      const appointment = await getAppointment(appointmentId, ['patientId'])
      res.status(200).json({ appointment })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

router.post(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    const searchableKeys = ['doctorId', 'patientId', 'date']
    const { page = 1, limit = 12 } = req.body

    const skip = (page - 1) * limit

    console.log({
      page,
      limit,
      skip,
      body: req.body
    })

    try {

      let query: any = {}
      searchableKeys.forEach(key => {
        if(req.body[key]){
          query[key] = req.body[key]
        }
      })

      console.log({query})
      
      const appointments = await getAppointments(query, ['patientId'], {skip, limit})
      res.status(200).json({ appointments })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

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
