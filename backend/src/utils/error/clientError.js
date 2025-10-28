import { StatusCodes } from 'http-status-codes';
class clientError extends Error {
  constructor({ message, explanation, statusCode }) {
    super(message);
    this.name = 'Client Error';
    this.explanation = explanation;
    this.statusCode = statusCode || StatusCodes.BAD_REQUEST;

  }
}
export default clientError;
