import mongoose from 'mongoose'

export interface DoctorAttrs {
    doctorId: mongoose.Types.ObjectId
    specialization: string
    fee: number
}

interface DoctorModel extends mongoose.Model<DoctorDoc> {
  build(attrs: DoctorAttrs): DoctorDoc;
}

export interface DoctorDoc extends mongoose.Document {
  doctorId: mongoose.Types.ObjectId;
  specialization: string;
  fee: number;
}

const doctorSchema = new mongoose.Schema<DoctorDoc>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      immutable: true
    },
    specialization: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id
        delete ret.__v
      },
    },
  }
)

doctorSchema.statics.build = (attrs: DoctorAttrs) => {
  return new Doctor(attrs)
}

const Doctor = mongoose.model<DoctorDoc, DoctorModel>('Doctor', doctorSchema)

export { Doctor }
