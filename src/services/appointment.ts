import { Appointment, AppointmentAttrs } from '../models/Appointment'

export const getAppointment = async (id: string, populate: string[] = []) => {
  return Appointment.findOne({ _id: id }).populate(populate)
}

export const getAppointments = async (
  query: any,
  populate: string[] = [],
  pagination?: { skip?: number, limit?: number } 
) => {
  const skip = pagination?.skip || 0
  const limit = pagination?.limit || Number.MAX_SAFE_INTEGER
  
  console.log({skip, limit})
  return Appointment.find(query)
    .populate(populate)
    .sort('date')
    .skip(skip)
    .limit(limit)
}

export const createAppointment = async (appointmentAttrs: AppointmentAttrs) => {
  const appointment = Appointment.build(appointmentAttrs)
  await appointment.save()
  return appointment
}

export const updateAppointment = async (id: string, appointmentAttrs: Partial<AppointmentAttrs>) => {
  const result = await Appointment.findByIdAndUpdate(id, appointmentAttrs)
  console.log('appointment updated' , result)
}