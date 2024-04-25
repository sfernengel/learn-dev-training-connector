import { readConfiguration } from '../utils/config.utils';
import { Type } from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';


const ORDER_CREATE_EXTENSION_KEY = 'validate-customer-orderCreateExtension';

  

export async function createType(): Promise<void> {

  const customerBlockTypeKey:string = readConfiguration().customerBlockTypeKey;
  
  let type: Type;
  
  const apiRoot = createApiRoot();

  const {
    body: { results: types },
  } = await apiRoot
    .types()
    .get({
      queryArgs: {
        where: `key = "${customerBlockTypeKey}"`,
      },
    })
    .execute();

  if (types.length > 0) {
    type = types[0];
  } else {
    type = await apiRoot
      .types()
      .post({
        body: {
          key: customerBlockTypeKey,
          name: {
            en: 'Custom Type to block the customer',
          },
          resourceTypeIds: ["customer"],
          fieldDefinitions: [
            {
              type: {
                  name: "Boolean"
              },
              name: "allowed-to-place-orders",
              label: {
                  "en": "Allowed to place orders"
              },
              required: true,
            },
            {
              type: {
                  name: "String"
              },
              name: "reason-for-blocking",
              label: {
                  "en": "Reason"
              },
              required: true,
            }
          ]
        },
      })
      .execute().then(type => type.body);
  }
  
  
}

export async function createOrderCreateExtension(
  applicationUrl: string
): Promise<void> {
  
  const apiRoot = createApiRoot();

  const {
    body: { results: extensions },
  } = await apiRoot
    .extensions()
    .get({
      queryArgs: {
        where: `key = "${ORDER_CREATE_EXTENSION_KEY}"`,
      },
    })
    .execute();

  if (extensions.length > 0) {
    const extension = extensions[0];

    await apiRoot
      .extensions()
      .withKey({ key: ORDER_CREATE_EXTENSION_KEY })
      .delete({
        queryArgs: {
          version: extension.version,
        },
      })
      .execute();
  }

  await apiRoot
    .extensions()
    .post({
      body: {
        key: ORDER_CREATE_EXTENSION_KEY,
        destination: {
          type: 'HTTP',
          url: applicationUrl,
        },
        triggers: [
          {
            resourceTypeId: 'order',
            actions: ['Create'],
          },
        ],
      },
    })
    .execute();
}

export async function deleteType(): Promise<void> {

  const customerBlockTypeKey:string = readConfiguration().customerBlockTypeKey;
  
  let type: Type;
  
  const apiRoot = createApiRoot();

  const {
    body: { results: types },
  } = await apiRoot
    .types()
    .get({
      queryArgs: {
        where: `key = "${customerBlockTypeKey}"`,
      },
    })
    .execute();

  if (types.length > 0) {
    type = types[0];
  
    
    await apiRoot
      .types()
      .withId({ID: type.id})
      .delete(
        {queryArgs: {
          version: type.version,
        }}
      )
      .execute();
  }
}

export async function deleteOrderCreateExtension(): Promise<void> {
  
  const apiRoot = createApiRoot();

  const {
    body: { results: extensions },
  } = await apiRoot
    .extensions()
    .get({
      queryArgs: {
        where: `key = "${ORDER_CREATE_EXTENSION_KEY}"`,
      },
    })
    .execute();

  if (extensions.length > 0) {
    const extension = extensions[0];

    await apiRoot
      .extensions()
      .withKey({ key: ORDER_CREATE_EXTENSION_KEY })
      .delete({
        queryArgs: {
          version: extension.version,
        },
      })
      .execute();
  }
}