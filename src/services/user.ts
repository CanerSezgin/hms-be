import mongoose from 'mongoose'
import { User, UserAttrs, UserDoc } from '../models/User'
import { Doctor, DoctorAttrs, DoctorDoc } from '../models/Doctor'
import { UserType } from '../types'

const doctorORM = (userObj: UserDoc, doctorObj: DoctorDoc) => {
  return {
    _id: userObj._id,
    name: userObj.name,
    surname: userObj.surname,
    specialization: doctorObj.specialization,
    email: userObj.email,
    fee: doctorObj.fee,
    fullname: `${userObj.name} ${userObj.surname}`
  }
}

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

export const getUsersByType = async (userType: UserType, additionalQuery = {}) => {
  const query = { userType, ...additionalQuery }
  console.log(query)
  const users = await User.find(query)
  console.log(users)

  if(userType === UserType.doctor){
    return Promise.all(users.map(async user => {
      const doctorData = await getAdditionalData(user) as DoctorDoc
      return doctorORM(user, doctorData)
    }))
  }

  return users
}

export const getDoctorByUserId = async (userId: mongoose.Types.ObjectId) => {
  const doctor = await Doctor.findOne({ doctorId: userId })
  return doctor
}

export const getDoctorsBySpec = async (specialization: string) => {
  const doctorsData = await Doctor.find({ specialization })
  const doctorIds = doctorsData.map(data => data.doctorId)
  const usersData = await User.find({ _id: { $in: doctorIds } })
  console.log(usersData)

  return doctorsData.map(doctorData => {
    const user = usersData.find(userData => (userData._id).toString() === (doctorData.doctorId).toString()) as UserDoc
    return user ? doctorORM(user, doctorData) : {}
  })
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