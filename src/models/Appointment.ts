import mongoose from 'mongoose'
import { AppointmentStatus, AppointmentTimeSlot } from '../types'

export interface AppointmentAttrs {
  doctorId: mongoose.Schema.Types.ObjectId;
  patientId: mongoose.Schema.Types.ObjectId;
  date: Date;
  time: string;
  status?: string;
  diagnose?: string;
  patientStory?: string;
  isPaid: boolean
}

interface AppointmentModel extends mongoose.Model<AppointmentDoc> {
  build(attrs: AppointmentAttrs): AppointmentDoc;
}

interface AppointmentDoc extends mongoose.Document {
  doctorId: mongoose.Schema.Types.ObjectId;
  patientId: mongoose.Schema.Types.ObjectId;
  date: Date;
  time: string;
  status: string;
  diagnose: string;
  patientStory: string;
  isPaid: boolean
}

const appointmentSchema = new mongoose.Schema<AppointmentDoc>(
  {
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
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      enum: AppointmentTimeSlot,
      required: true,
    },
    status: {
      type: String,
      default: AppointmentStatus.pending,
      enum: AppointmentStatus,
    },
    diagnose: {
      type: String,
    },
    patientStory: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false
    }
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

appointmentSchema.statics.build = (attrs: AppointmentAttrs) => {
  return new Appointment(attrs)
}

const Appointment = mongoose.model<AppointmentDoc, AppointmentModel>(
  'Appointment',
  appointmentSchema
)

export { Appointment }
