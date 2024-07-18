import { Request, Response } from 'express';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http-status.constants.js';
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
  if(error instanceof CustomError && error.statusCode === HTTP_STATUS_SUCCESS_ACCEPTED) {
    console.log(error.message);
    return;
  }
  console.log(error);
};
