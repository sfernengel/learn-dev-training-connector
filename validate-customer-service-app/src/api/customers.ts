import { Customer } from "@commercetools/platform-sdk";
import { createApiRoot } from "../client/create.client";

export const getCustomerById = async(customerId: string) : Promise<Customer> => {
    
    const customer = await createApiRoot()
        .customers()
        .withId({ID: customerId})
        .get()
        .execute().then(response => response.body);
    
    return customer;
}