import { createApiRoot } from './create.client';

export async function getCustomerById(customerId: string) {
  return await createApiRoot()
    .customers()
    .withId({
      ID: customerId,
    })
    .get()
    .execute()
    .then((response) => response.body);
}

export async function getOrderById(orderId: string) {
  return await createApiRoot()
    .orders()
    .withId({
      ID: orderId,
    })
    .get()
    .execute()
    .then((response) => response.body);
}
