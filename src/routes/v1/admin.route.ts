import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createUser, createDoctor, getUsersByType, deleteDoctor, updateDoctor, getUserById, deleteUser, updateUser } from '../../services/user'
import { getDoctorsBySpec } from '../../services/user'
import validationMiddleware from '../../middlewares/validation.middleware'
import { UserType } from '../../types'
import mongoose from 'mongoose'
import BadRequestError from '../../utils/errors/bad-request-error'
import NotFoundError from '../../utils/errors/not-found-error'

const router = express.Router()

router.post(
  '/staff',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
    body('name').trim().notEmpty().withMessage('You must supply a name'),
    body('surname').trim().notEmpty().withMessage('You must supply a surname'),
    body('userType')
      .trim()
      .notEmpty()
      .withMessage('You must supply userType'),
    validationMiddleware,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
      const { userType } = req.body


    try {

        if(!(userType in UserType))
            throw new BadRequestError('Invalid User Type')
        

        if(userType === UserType.doctor && (!req.body.specialization || !req.body.fee))
            throw new BadRequestError('Missing doctor specialization or fee')
        

        const user = await createUser(req.body)
        
        if(userType === UserType.doctor){
            await createDoctor({
                doctorId: user._id,
                specialization: req.body.specialization,
                fee: req.body.fee
            })
        }

        res.status(201).json({ message: 'User Created', user })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

router.get('/staff/:userType', async (req: Request, res: Response, next: NextFunction) => {
    const userType = req.params.userType as UserType

    try {

        if(!(userType in UserType)){
            throw new BadRequestError('Invalid User Type')
        }

        const users = await getUsersByType(userType)

        res.status(200).json({ users })
      } catch (error) {
        console.log(error)
        next(error)
      }
})

router.delete('/staff/:userId', async (req: Request, res: Response, next: NextFunction) => {
    const  userId  = new mongoose.Types.ObjectId(req.params.userId)

    try {
        const user = await getUserById(userId)
        if(!user) throw new NotFoundError()

        await deleteUser(userId)

        if(user.userType === UserType.doctor) await deleteDoctor(userId)
        
        res.sendStatus(204)
      } catch (error) {
        console.log(error)
        next(error)
      }
})

router.put('/staff/:userId', async (req: Request, res: Response, next: NextFunction) => {
    const userId  = new mongoose.Types.ObjectId(req.params.userId)

    try {
        const user = await getUserById(userId)
        if(!user) throw new NotFoundError()

        await updateUser(userId, req.body)

        if(user.userType === UserType.doctor) await updateDoctor(userId, req.body)

        return res.status(200).json({ userId})
      } catch (error) {
        console.log(error)
        next(error)
      }
})

router.get('/doctor/:specialization', async (req: Request, res: Response, next: NextFunction) => {
  const { specialization } = req.params

  try {
      const doctorsBySpec = await getDoctorsBySpec(specialization)

      res.status(200).json({ doctors: doctorsBySpec })
    } catch (error) {
      console.log(error)
      next(error)
    }
})

export default router
