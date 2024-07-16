import { Request, Response } from 'express';
import { apiSuccess } from '../api/success.api';
import CustomError, { ErrorDetail } from '../errors/custom.error';
import { orderController } from './order.controller';

/**
 * Exposed service endpoint.
 * - Receives a POST request, parses the action and the controller
 * and returns it to the correct controller. We should be use 3. `Cart`, `Order` and `Payments`
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (request: Request, response: Response) => {
  // Deserialize the action and resource from the body
  const { action, resource } = request.body;

  if (!action || !resource) {
    const errorDetails: ErrorDetail[] = [
      {
        code: 'InvalidOperation',
        message: `Bad request - Missing body parameters.`,
      },
    ];
    throw new CustomError(400, errorDetails);
  }

  // Identify the type of resource in order to redirect
  // to the correct controller
  switch (resource.typeId) {
    case 'order':
      try {
        const data = await orderController(action, resource);
        if (data && (data.statusCode === 200 || data.statusCode === 201)) {
          apiSuccess(data.statusCode, data.actions, response);
          return;
        }

        const errorDetails: ErrorDetail[] = [
          {
            code: 'InvalidOperation',
            message: JSON.stringify(data),
          },
        ];
        throw new CustomError(data ? data.statusCode : 400, errorDetails);
      } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        } else if (error instanceof Error) {
          const errorDetails: ErrorDetail[] = [
            {
              code: 'InternalServerError',
              message: error.message,
            },
          ];
          throw new CustomError(500, errorDetails);
        }
      }

      break;

    default:
      const errorDetails: ErrorDetail[] = [
        {
          code: 'InvalidOperation',
          message: `Resource not recognized. Allowed values are 'order'.`,
        },
      ];
      throw new CustomError(400, errorDetails);
  }
};
