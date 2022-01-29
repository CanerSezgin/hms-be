import mongoose from 'mongoose'
import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { createTest, createTestType, getTestTypesByType, updateTestFee, deleteTestType, search } from '../../services/test'
import validationMiddleware from '../../middlewares/validation.middleware'
import BadRequestError from '../../utils/errors/bad-request-error'
import { TestTypeEnum } from '../../types'

const router = express.Router()

router.post(
  '/types',
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

router.get('/types/:type', async (req: Request, res: Response, next: NextFunction) => {
  const {type} = req.params

  try {

    if(!(type in TestTypeEnum)){
      throw new BadRequestError('Invalid Test Type')
    }

    const tests = await getTestTypesByType(type as TestTypeEnum)
    res.status(200).json({ tests })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.put('/types',
[
  body('type').notEmpty(),
  body('name').trim().notEmpty().withMessage('You must supply a name'),
  body('fee').notEmpty().isNumeric().withMessage('Fee should be numeric'),
  validationMiddleware,
],
async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateTestFee(req.body)
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.delete('/types/:testTypeId',
async (req: Request, res: Response, next: NextFunction) => {
  const  testTypeId  = new mongoose.Types.ObjectId(req.params.testTypeId)

  try {
    await deleteTestType(testTypeId)
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

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

router.get(
  '/patients/:patientId',
  async (req: Request, res: Response, next: NextFunction) => {
    const { patientId } = req.params

    try {
      const tests = await search({ patientId })

      res.status(200).json({ tests })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

export default router
