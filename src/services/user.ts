import { User, UserAttrs } from '../models/User'

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email })
}

export const createUser = async (userAttrs: UserAttrs) => {
  const user = User.build(userAttrs)
  await user.save()
  return user
}
