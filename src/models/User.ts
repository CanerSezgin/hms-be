import mongoose from 'mongoose'
import { Password } from '../utils/password'
import { UserType, Gender } from '../types'

export interface UserAttrs {
  email: string;
  password: string;
  userType: UserType;
  name: string;
  surname: string;
  phone?: string;
  gender?: Gender;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  userType: UserType;
  name: string;
  surname: string;
  phone?: string;
  gender?: Gender;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: Number,
      required: true,
      enum: UserType,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: Gender,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret.__v
      },
    },
  }
)

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
