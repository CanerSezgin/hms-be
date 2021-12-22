import mongoose from 'mongoose'
import { TestStatus } from '../types'

export interface TestAttrs {
  appointmentId: mongoose.Schema.Types.ObjectId;
  doctorId: mongoose.Schema.Types.ObjectId;
  patientId: mongoose.Schema.Types.ObjectId;
  testTypeId: mongoose.Schema.Types.ObjectId;
  status?: string;
  fileId?: string;
  requestedAt?: Date;
  resultAt?: Date;
}

interface TestModel extends mongoose.Model<TestDoc> {
  build(attrs: TestAttrs): TestDoc;
}

interface TestDoc extends mongoose.Document {
  appointmentId: mongoose.Schema.Types.ObjectId;
  doctorId: mongoose.Schema.Types.ObjectId;
  patientId: mongoose.Schema.Types.ObjectId;
  testTypeId: mongoose.Schema.Types.ObjectId;
  status: string;
  fileId: string;
  requestedAt: Date;
  resultAt: Date;
}

const testSchema = new mongoose.Schema<TestDoc>(
  {
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestType',
      required: true
    },
    status: {
      type: String,
      default: TestStatus.pending,
      enum: TestStatus,
    },
    fileId: {
      type: String,
    },
    requestedAt: {
      type: Date,
      default: new Date(),
    },
    resultAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      },
    },
  }
)

testSchema.statics.build = (attrs: TestAttrs) => {
  return new Test(attrs)
}

const Test = mongoose.model<TestDoc, TestModel>('Test', testSchema)

export { Test }
