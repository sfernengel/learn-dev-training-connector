import { UpdateAction } from '@commercetools/sdk-client-v2';

import CustomError, { ErrorDetail } from '../errors/custom.error';
import { Resource } from '../interfaces/resource.interface';
import { readConfiguration } from '../utils/config.utils';
import { getCustomerById } from '../api/customers';
import { getTypeByKey } from '../api/types';
import { logger } from '../utils/logger.utils';

/**
 * Handle the update action
 *
 * @param {Resource} resource The resource from the request body
 * @returns {object}
 */
export const create = async (resource: Resource) => {
  const updateActions: Array<UpdateAction> = [];
  const { customerBlockTypeKey } = readConfiguration();

  try {
    const order = JSON.parse(JSON.stringify(resource));
    const customerId = order?.obj?.customerId;
    if (customerId) {
      const customer = await getCustomerById(customerId).catch(
        (_) => undefined
      );
      if (!customer) {
        return { statusCode: 201, actions: updateActions };
      }

      let canPlaceOrders = undefined;
      console.log({ DEBUG: canPlaceOrders });

      const type = await getTypeByKey(customerBlockTypeKey).catch(
        (_) => undefined
      );
      if (!type) {
        return { statusCode: 201, actions: updateActions };
      }

      const fd = type.fieldDefinitions.find((fd) => fd.type.name == 'Boolean');
      if (fd && fd.name) {
        canPlaceOrders = customer?.custom?.fields?.[fd.name];
      }
      console.log({ DEBUG: canPlaceOrders });
      switch (canPlaceOrders) {
        case undefined:
        case true:
          logger.info('Can place order or custom field not defined');
          return { statusCode: 201, actions: updateActions };

        case false:
          logger.info('Customer can not place orders');
          const errorDetails: ErrorDetail[] = [
            {
              code: 'InvalidOperation',
              message: `Customer has been blocked from placing orders`,
            },
          ];
          throw new CustomError(400, errorDetails);
      }
    }
  } catch (error) {
    // Retry or handle the error
    // Create an error object
    if (error instanceof CustomError) {
      throw error;
    } else if (error instanceof Error) {
      const errorDetails: ErrorDetail[] = [
        {
          code: 'InternalServerError',
          message: `Internal server error on OrderController`,
        },
      ];
      throw new CustomError(500, errorDetails);
    }
  }
};

/**
 * Handle the cart controller according to the action
 *
 * @param {string} action The action that comes with the request. Could be `Create` or `Update`
 * @param {Resource} resource The resource from the request body
 * @returns {Promise<object>} The data from the method that handles the action
 */
export const orderController = async (action: string, resource: Resource) => {
  switch (action) {
    case 'Create':
      return create(resource);
    case 'Update': {
      break;
    }
    default:
      const errorDetails: ErrorDetail[] = [
        {
          code: 'InvalidOperation',
          message: `Action not recognized. Allowed values are 'Create' or 'Update'.`,
        },
      ];
      throw new CustomError(500, errorDetails);
  }
};
