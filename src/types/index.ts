export enum Gender {
  male = 'm',
  female = 'f',
}

export enum UserType {
  admin = 'admin',
  patient = 'patient',
  doctor = 'doctor',
  lab = 'lab',
  receptionist = 'receptionist'
}

export enum TestStatus {
  pending = 'pending',
  done = 'done',
}

export enum TestTypeEnum {
  analysis = 'analysis',
  imaging = 'imaging',
}

export enum AppointmentStatus {
  pending = 'pending',
  done = 'done',
}

export enum AppointmentTimeSlot {
  '09:00-09:30' = '09:00-09:30',
  '09:30-10:00' = '09:30-10:00',
  '10:00-10:30' = '10:00-10:30',
  '10:30-11:00' = '10:30-11:00',
  '11:00-11:30' = '11:00-11:30',
  '11:30-12:00' = '11:30-12:00',
  '13:00-13:30' = '13:00-13:30',
  '13:30-14:00' = '13:30-14:00',
  '14:00-14:30' = '14:00-14:30',
  '14:30-15:00' = '14:30-15:00',
  '15:00-15:30' = '15:00-15:30',
  '15:30-16:30' = '15:30-16:30'
}