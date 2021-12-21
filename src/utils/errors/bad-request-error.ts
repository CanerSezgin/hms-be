import CustomError from './custom-error'

export default class BadRequestError extends CustomError {
  constructor(public message: string, public statusCode: number = 400) {
    super(`Bad Request: ${message}`)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors = () => [{ message: this.message }];
}
