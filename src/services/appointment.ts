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

export const getStats = async () => {
  const aggregation = await Appointment.aggregate([
    {
      $lookup: {
        from: 'doctors',
        localField: 'doctorId',
        foreignField: 'doctorId',
        as: 'doctors'
      },
    },
    {
      $unwind: '$doctors'
    },
    {
      $group: {
        _id: { specialization: '$doctors.specialization' },
        amount: { 
          $sum: '$doctors.fee'
        },
        count: { $sum: 1 }
      }
    },
  ])

  const total = aggregation.reduce((result, obj) => {
    result.amount += obj.amount
    result.count += obj.count
    return result
  }, {
    amount: 0,
    count: 0
  })

  return {
    total,
    aggregation
  }
}
