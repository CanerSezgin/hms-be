import jwt from 'jsonwebtoken'
import { config } from '../config'

interface UserJWTPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserJWTPayload;
    }
  }
}

class UserJWT {
  private key = config.jwt.secret;
  generate(userId: string, email: string, userType?: number) {
    const userJwt = jwt.sign(
      {
        id: userId,
        email: email,
        userType
      },
      this.key
    )
    return userJwt
  }

  verify(token: string): UserJWTPayload {
    return jwt.verify(token, this.key) as UserJWTPayload
  }
}

export const userJwt = new UserJWT()
