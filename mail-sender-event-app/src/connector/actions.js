import {
  CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES,
  CUSTOMER_EMAIL_TOKEN_SUBSCRIPTION_MESSAGE_TYPES,
  CUSTOMER_PASSWORD_TOKEN_SUBSCRIPTION_MESSAGE_TYPES,
  ORDER_SUBSCRIPTION_MESSAGE_TYPES,
} from '../constants/constants.js';
const EMAIL_DELIVERY_SUBSCRIPTION_KEY =
  'dev-training-email-delivery-subscription';

async function getEmailDevlierySubscription(apiRoot) {
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
  return subscriptions;
}

export async function deleteEmailDeliverySubscription(apiRoot) {
  const subscriptions = await getEmailDevlierySubscription(apiRoot);
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

export async function createEmailDeliverySubscripition(
  apiRoot,
  topicName,
  projectId
) {
  await deleteEmailDeliverySubscription(apiRoot);
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


function buildOrderChangeMessageType() {
  const messageType = {
    resourceTypeId: 'order',
    types: ORDER_SUBSCRIPTION_MESSAGE_TYPES,
  };
  return messageType;
}
