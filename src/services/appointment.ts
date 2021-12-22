import { Appointment, AppointmentAttrs } from '../models/Appointment'

export const createAppointment = async (appointmentAttrs: AppointmentAttrs) => {
  const appointment = Appointment.build(appointmentAttrs)
  await appointment.save()
  return appointment
}