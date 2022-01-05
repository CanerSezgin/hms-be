import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createUser, createDoctor, getDoctors, deleteDoctor } from '../../services/user'
import validationMiddleware from '../../middlewares/validation.middleware'
import { UserAttrs } from '../../models/User'
import { UserType } from '../../types'
import mongoose from 'mongoose'

const router = express.Router()

router.post(
  '/doctors',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
    body('name').trim().notEmpty().withMessage('You must supply a name'),
    body('surname').trim().notEmpty().withMessage('You must supply a surname'),
    body('specialization')
      .trim()
      .notEmpty()
      .withMessage('You must supply specialization'),
    body('fee')
      .isNumeric()
      .notEmpty()
      .withMessage('You must supply consultancy fee'),
    validationMiddleware,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
      const userPayload: UserAttrs = {
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password,
        userType: UserType.doctor,
      }

    try {
      const user = await createUser(userPayload)
      const doctor = await createDoctor({
          doctorId: user._id,
          specialization: req.body.specialization,
          fee: req.body.fee
      })

      res.status(201).json({ message: 'doctor created', user, doctor });
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

router.get('/doctors', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctors = await getDoctors()

        res.status(200).json({ doctors })
      } catch (error) {
        console.log(error)
        next(error)
      }
})

router.delete('/doctors/:userId', async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params

    try {
        await deleteDoctor(new mongoose.Types.ObjectId(userId))

        res.sendStatus(204)
      } catch (error) {
        console.log(error)
        next(error)
      }
})

export default router
