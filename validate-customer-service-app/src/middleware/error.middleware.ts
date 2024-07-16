import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import CustomError from '../errors/custom.error';

/**
 * Middleware for error handling
 * @param error The error object
 * @param req The express request
 * @param res The Express response
 * @param next
 * @returns
 */
export const errorMiddleware: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    if (typeof error.statusCode === 'number') {
      res.status(error.statusCode).json({
        errors: [
          {
            code: 'InvalidOperation',
            message: error.message,
            errors: error.errors,
          },
        ],
      });

      return;
    }
  }

  res.status(500).json({
    errors: [
      {
        code: 'Internal server error',
        message: error.message,
        errors: [{ code: 'Internal server error', message: error.message }],
      },
    ],
  });
};
