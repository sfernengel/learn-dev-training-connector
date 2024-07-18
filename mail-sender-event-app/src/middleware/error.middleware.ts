import { Request, Response } from 'express';
import CustomError from '../errors/custom.error.js';

/**
 * Middleware for error handling
 * @param error The error object
 * @param req The express request
 * @param res The Express response
 * @param next
 * @returns
 */
export const errorMiddleware = (error: Error, req: Request, res: Response, next: any) => {
  console.log("error middleware activated");
  if (error instanceof CustomError) {
    if (typeof error.statusCode === 'number') {
      res.status(error.statusCode).json({
        message: error.message,
        errors: error.errors,
      });

      return;
    }
  }

  

  // res.status(500).send('Internal server error');
};
