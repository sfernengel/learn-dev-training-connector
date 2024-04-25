import { Request, Response } from 'express';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http-status.constants.js';
import {
  doValidation,
  isOrderConfirmationMessage
} from '../validators/message.validators.js';
import { decodeToJson } from '../utils/decoder.utils.js';
import HandlerFactory from '../factory/handler.factory.js';
import {
  HANDLER_TYPE_ORDER_CONFIRMATION,
  } from '../constants/handler-type.constants.js';
import CustomError from '../errors/custom.error.js';
import GenericHandler from '../handlers/generic.handler.js';

/**
 * Exposed event POST endpoint.
 * Receives the Pub/Sub message and works with it
 *
 * @typedef {import("express").Response} Response
 * @typedef {import("express").Request} Request
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const messageHandler = async (request: Request, response: Response) => {
  // Send ACCEPTED acknowledgement to Subscription
  response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send();

  try {
    // Check request body
    doValidation(request);

    const encodedMessageBody = request.body.message.data;
    const messageBody = decodeToJson(encodedMessageBody);
    const handlerFactory = new HandlerFactory();
    // let handler: any;
    if (isOrderConfirmationMessage(messageBody)) {
      const handler: any = handlerFactory.getHandler(HANDLER_TYPE_ORDER_CONFIRMATION);
      await handler.process(messageBody);
    } 
    
  } catch (error) {
    throw new CustomError(400, `Bad request: ${error}`);
  }
};
