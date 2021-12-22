import { Test } from '../models/Test'
import { TestType, TestTypeAttrs } from '../models/TestType'

export const createTestType = async (testTypeAttrs: TestTypeAttrs) => {
  const testType = TestType.build(testTypeAttrs)
  await testType.save()
  return testType
}
