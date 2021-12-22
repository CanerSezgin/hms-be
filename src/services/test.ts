import { Test, TestAttrs } from '../models/Test'
import { TestType, TestTypeAttrs } from '../models/TestType'

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