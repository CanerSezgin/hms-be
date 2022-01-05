import mongoose from 'mongoose'
import { User, UserAttrs, UserDoc } from '../models/User'
import { Doctor, DoctorAttrs } from '../models/Doctor'
import { UserType } from '../types'

const getAdditionalData = async (user: UserDoc): Promise<Record<string, any>> => {
  switch (user.userType) {
    case UserType.doctor:
      const doctor = await Doctor.findOne({ doctorId: user._id })
      return doctor ? doctor.toObject(): {}

    default:
      return {}
  }
}

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email })
  if(!user) return null
  const additionalData = await getAdditionalData(user)
  return {
    ...user.toObject(),
    ...additionalData
  }
}

export const getUserById = async (userId: mongoose.Types.ObjectId) => {
  const user = await User.findById(userId)
  if(!user) return null
  const additionalData = await getAdditionalData(user)
  return {
    ...user.toObject(),
    ...additionalData
  }
}

export const createUser = async (userAttrs: UserAttrs) => {
  const user = User.build(userAttrs)
  await user.save()
  return user
}

export const createDoctor = async (doctorAttrs: DoctorAttrs) => {
  const doctor = Doctor.build(doctorAttrs)
  await doctor.save()
  return doctor
}

export const getUsersByType = async (userType: UserType) => {
  const users = await User.find({ userType })

  if(userType === UserType.doctor){
    return Promise.all(users.map(async user => {
      const additionalData = await getAdditionalData(user)
  
      return {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        specialization: additionalData.specialization,
        email: user.email,
        fee: additionalData.fee,
      }
    }))
  }

  return users
}

export const getDoctorByUserId = async (userId: mongoose.Types.ObjectId) => {
  const doctor = await Doctor.findOne({ doctorId: userId })
  return doctor
}

export const deleteUser = async (userId: mongoose.Types.ObjectId) => {
  await User.findByIdAndDelete(userId)
}

export const deleteDoctor = async (userId: mongoose.Types.ObjectId) => {
  await Doctor.findOneAndDelete({ doctorId: userId })
}

export const updateDoctor = async (userId: mongoose.Types.ObjectId, payload: Record<string, any>) => {

  await Doctor.findOneAndUpdate({ doctorId: userId}, {
    specialization: payload.specialization,
    fee: payload.fee
  })
}

export const updateUser = async (userId: mongoose.Types.ObjectId, payload: Record<string, any>) => {
  await User.findOneAndUpdate({_id: userId }, {
    name: payload.name,
    surname: payload.surname,
    email: payload.email
  })
}