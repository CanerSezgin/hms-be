import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createAppointment, getAppointment, getAppointments, updateAppointment } from '../../services/appointment'
import * as testService from '../../services/test'
import * as prescriptionService from '../../services/prescription'
import validationMiddleware from '../../middlewares/validation.middleware'
import BadRequestError from '../../utils/errors/bad-request-error'
import { AppointmentTimeSlot } from '../../types'
import { getUserById } from '../../services/user'
import mongoose from 'mongoose'
import { Appointment } from '../../models/Appointment'

const router = express.Router()


router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: appointmentId } = req.params
    try {
      const appointment = await getAppointment(appointmentId, ['patientId'])
      if(!appointment) return res.status(404).json({ msg: 'Appointment not found' })

      const [ tests, prescription ] = await Promise.all([
        testService.search({ appointmentId: appointment._id }),
        prescriptionService.getPrescriptionByAppointmentId(appointment._id)
      ])

      res.status(200).json({ 
        appointment: {
          ...appointment.toObject(),
          tests,
          prescription
        }
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

router.post(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    const searchableKeys = ['doctorId', 'patientId', 'date', 'status', 'isPaid']
    const { page = 1, limit = 12, populate = false} = req.body

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
      
      let appointments = await getAppointments(query, ['patientId'], {skip, limit}) as any

      if(populate){
        appointments = await Promise.all(
          appointments.map(async (app: {_id: mongoose.Types.ObjectId, doctorId: mongoose.Types.ObjectId, toObject: any }) => {
            const { _id: appointmentId, doctorId } = app

            const doctor = await getUserById(doctorId)
            const tests = await testService.search({ appointmentId })
            const prescription = await prescriptionService.getPrescriptionByAppointmentId(appointmentId)

            return {
              ...app.toObject(),
              doctorId: doctor,
              tests,
              prescription
            }
          })
        )
      }

      console.log(appointments)

      res.status(200).json({ appointments, timeSlots: Object.values(AppointmentTimeSlot) })
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

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id: appointmentId } = req.params
  try {
    await updateAppointment(appointmentId, req.body)
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/:id/prescribe', 
[
  body('doctorId').trim().notEmpty().withMessage('Doctor ID missing'),
  body('patientId').trim().notEmpty().withMessage('Patient ID missing'),
  body('description').trim().notEmpty().withMessage('Description is missing'),
  validationMiddleware,
],
async (req: Request, res:Response, next: NextFunction) => {
  const { id: appointmentId } = req.params

  try {
    const prescription = await prescriptionService.createPresctiption({
      ...req.body,
      appointmentId
    })
    res.status(201).json({ message: 'prescription created', prescription })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get('/prescriptions/:patientId', async (req: Request, res:Response, next: NextFunction) => {
  const  patientId  = new mongoose.Types.ObjectId(req.params.patientId)

  try {
    const prescriptions = await prescriptionService.getPrescriptionsByPatientId(patientId)


    const prescriptionWithPopulatedDoctor = await Promise.all(
      prescriptions.map(async (pre: any) => {
        const doctor = await getUserById(pre.doctorId)
        return {
          ...pre.toObject(),
          doctorId: doctor
        }
      })
    )
        
    res.status(200).json({ prescriptions: prescriptionWithPopulatedDoctor })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router