import { UpdateAction } from '@commercetools/sdk-client-v2';

import CustomError from '../errors/custom.error';
import { Resource } from '../interfaces/resource.interface';
import { readConfiguration } from '../utils/config.utils';
import { getCustomerById } from '../api/customers';
import { getTypeByKey } from '../api/types';
import { isHttpError } from '../types/index.types';

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
    const customerId = order.obj.customerId;
    if (customerId) {
      const customer = await getCustomerById(customerId);
      let canPlaceOrders = false;

      const type = await getTypeByKey(customerBlockTypeKey);
      if (type.fieldDefinitions.find((fd) => fd.type.name == 'Boolean')) {
        const fieldName: string =
          type.fieldDefinitions.find((fd) => fd.type.name == 'Boolean')?.name ??
          '';
        canPlaceOrders =
          customer?.custom?.fields?.[
            fieldName as keyof typeof customer.custom.fields
          ];
      }

      switch (canPlaceOrders) {
        case undefined:
        case true:
          console.log('Can place order or custom field not defined');
          return { statusCode: 200, actions: updateActions };

        case false:
          console.log('Customer can not place orders');
          updateActions.push({
            action: 'Customer has been blocked from placing orders',
          });
          return { statusCode: 400, actions: updateActions };
      }
    }
  } catch (error) {
    // Retry or handle the error
    // Create an error object
    if (isHttpError(error) && error.status === 404) {
      console.log(
        'Customer or Type does not exist. (Anonymous) customer can place order.'
      );
      return { statusCode: 200, actions: updateActions };
    }
    if (error instanceof Error) {
      throw new CustomError(
        400,
        `Internal server error on OrderController: ${error.stack}`
      );
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
      throw new CustomError(
        500,
        `Internal Server Error - Action not recognized. Allowed values are 'Create' or 'Update'.`
      );
  }
};
