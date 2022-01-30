import { groupBy } from 'lodash'
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

export const search = async (query: Record<string, any>) => {
  const populate = ['doctorId', 'patientId', 'testTypeId']
  const tests = await Test.find(query).populate(populate).sort('requestedAt')
  return groupBy(tests, 'testTypeId.type')
}

export const updateTest = async (id: string, testAttrs: Partial<TestAttrs>) => {
  await Test.findByIdAndUpdate(id, testAttrs)
}

export const getStats = async () => {
  const aggregation = await Test.aggregate([
    {
      $lookup: {
        from: 'testtypes',
        localField: 'testTypeId',
        foreignField: '_id',
        as: 'tests'
      },
    },
    {
      $unwind: '$tests'
    },
    {
      $group: {
        _id: { type: '$tests.type' }, 
        amount: { 
          $sum: '$tests.fee'
        },
        count: { $sum: 1 }
      }
    },
  ])

  const total = aggregation.reduce((result, obj) => {
    result.amount += obj.amount
    result.count += obj.count
    return result
  }, {
    amount: 0,
    count: 0
  })

  return {
    total,
    aggregation
  }
}
