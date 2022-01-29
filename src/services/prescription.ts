import mongoose from 'mongoose'
import { Prescription, PrescriptionAttrs } from '../models/Prescription'

export const createPresctiption = async (
  prescriptionAttrs: PrescriptionAttrs
) => {
  const prescription = Prescription.build(prescriptionAttrs)
  await prescription.save()
  return prescription
}

export const getPrescriptionByAppointmentId = async (
    appointmentId: any
) => {
    const prescription = await Prescription.findOne({ appointmentId })
    return prescription
}

export const getPrescriptionsByPatientId = async (patientId: any) => {
  const prescriptions = await Prescription.find({ patientId }) 
  return prescriptions
}