import mongoose from 'mongoose'

export interface PrescriptionAttrs {
    appointmentId: mongoose.Schema.Types.ObjectId;
    doctorId: mongoose.Schema.Types.ObjectId;
    patientId: mongoose.Schema.Types.ObjectId;
    description: string;
}

interface PrescriptionModel extends mongoose.Model<PrescriptionDoc> {
  build(attrs: PrescriptionAttrs): PrescriptionDoc;
}

interface PrescriptionDoc extends mongoose.Document {
    appointmentId: mongoose.Schema.Types.ObjectId;
    doctorId: mongoose.Schema.Types.ObjectId;
    patientId: mongoose.Schema.Types.ObjectId;
    description: string;
}

const prescriptionSchema = new mongoose.Schema<PrescriptionDoc>(
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
    description: {
      type: String,
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

prescriptionSchema.statics.build = (attrs: PrescriptionAttrs) => {
  return new Prescription(attrs)
}

const Prescription = mongoose.model<PrescriptionDoc, PrescriptionModel>(
  'Prescription',
  prescriptionSchema
)

export { Prescription }
