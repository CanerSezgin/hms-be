import mongoose from 'mongoose'
import { TestTypeEnum } from '../types'

export interface TestTypeAttrs {
  type: TestTypeEnum;
  name: string;
  fee: number
}

interface TestTypeModel extends mongoose.Model<TestTypeDoc> {
  build(attrs: TestTypeAttrs): TestTypeDoc;
}

interface TestTypeDoc extends mongoose.Document {
  type: TestTypeEnum;
  name: string;
  fee: number;
}

const testTypeSchema = new mongoose.Schema<TestTypeDoc>(
  {
    type: {
      type: String,
      enum: TestTypeEnum,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    fee: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      },
    },
  }
)

testTypeSchema.statics.build = (attrs: TestTypeAttrs) => {
  return new TestType(attrs)
}

const TestType = mongoose.model<TestTypeDoc, TestTypeModel>(
  'TestType',
  testTypeSchema
)

export { TestType }
