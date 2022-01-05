import mongoose from 'mongoose'
import { Test, TestAttrs } from '../models/Test'
import { TestType, TestTypeAttrs } from '../models/TestType'
import { TestTypeEnum } from '../types'

export const createTestType = async (testTypeAttrs: TestTypeAttrs) => {
  const testType = TestType.build(testTypeAttrs)
  await testType.save()
  return testType
}

export const createTest = async (testAttrs: TestAttrs) => {
  const test = Test.build(testAttrs)
  await test.save()
  return test
}

export const getTestTypesByType = async (type: TestTypeEnum) => {
  const testTypes = await TestType.find({ type })
  return testTypes
}

export const updateTestFee = async (testTypeAttrs: TestTypeAttrs) => {
  await TestType.findOneAndUpdate(
    { type: testTypeAttrs.type, name: testTypeAttrs.name }, 
    { fee: testTypeAttrs.fee }
  )
}

export const deleteTestType = async (testTypeId: mongoose.Types.ObjectId) => {
  await TestType.findOneAndDelete({ _id: testTypeId })
}