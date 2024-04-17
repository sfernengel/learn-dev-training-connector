import { createApiRoot } from '../client/create.client.js';
import {
  ORDER_SUBSCRIPTION_MESSAGE_TYPES,
} from '../constants/constants.js';

function buildOrderChangeMessageType() {
  const messageType = {
    resourceTypeId: 'order',
    types: ORDER_SUBSCRIPTION_MESSAGE_TYPES,
  };
  return messageType;
}

const EMAIL_DELIVERY_SUBSCRIPTION_KEY =
  'dev-training-email-subscription';

export async function createEmailDeliverySubscripition(
  topicName: string,
  projectId: string
): Promise<void> {
  const apiRoot = createApiRoot();
  const {
    body: { results: subscriptions },
  } = await apiRoot
    .subscriptions()
    .get({
      queryArgs: {
        where: `key = "${EMAIL_DELIVERY_SUBSCRIPTION_KEY}"`,
      },
    })
    .execute();

  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];

    await apiRoot
      .subscriptions()
      .withKey({ key: EMAIL_DELIVERY_SUBSCRIPTION_KEY })
      .delete({
        queryArgs: {
          version: subscription.version,
        },
      })
      .execute();
  }

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: EMAIL_DELIVERY_SUBSCRIPTION_KEY,
        destination: {
          type: 'GoogleCloudPubSub',
          topic: topicName,
          projectId,
        },
        messages: [
          buildOrderChangeMessageType(),
        ],
      },
    })
    .execute();
}

export async function deleteEmailDeliverySubscription(
): Promise<void> {
  
  const apiRoot = createApiRoot();

  const {
    body: { results: subscriptions },
  } = await apiRoot
    .subscriptions()
    .get({
      queryArgs: {
        where: `key = "${EMAIL_DELIVERY_SUBSCRIPTION_KEY}"`,
      },
    })
    .execute();

  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];

    await apiRoot
      .subscriptions()
      .withKey({ key: EMAIL_DELIVERY_SUBSCRIPTION_KEY })
      .delete({
        queryArgs: {
          version: subscription.version,
        },
      })
      .execute();
  }
}
