import GenericHandler from './generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { getOrderById, getCustomerById } from '../client/query.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';
import { convertMoneyToText } from '../utils/money.utils.js';
import { readConfiguration } from '../utils/config.utils.js';

import sgMail from '@sendgrid/mail'
import { item } from '../types/index.types.js';


const DEFAULT_LOCALE = 'en-US';
const DEFAULT_CUSTOMER_NAME = 'Customer';
class OrderConfirmationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody: any) {
    const senderEmailAddress = readConfiguration().senderEmailAddress;
    const templateId = readConfiguration().templateId;
    
    sgMail.setApiKey(readConfiguration().sgMailApiKey);

    const orderId = messageBody.resource.id;
    const order = await getOrderById(orderId);
    
      let customer;
      let customerEmail = order.customerEmail;
      if (order.customerId) {
        customer = await getCustomerById(order.customerId);
      }
      const orderLineItems: item[] = [];

      for (const lineItem of order.lineItems) {
        const item: item = {
          productName: lineItem.name[DEFAULT_LOCALE],
          productQuantity: lineItem.quantity,
          productSku: lineItem.variant.sku,
          productSubTotal: convertMoneyToText(lineItem.totalPrice),
        };
        orderLineItems.push(item);
      }
      const orderDetails = {
        orderNumber: order.orderNumber ? order.orderNumber : '',
        customerEmail,
        customerFirstName: customer?.firstName
          ? customer.firstName
          : DEFAULT_CUSTOMER_NAME,
        customerMiddleName: customer?.middleName ? customer.middleName : '',
        customerLastName: customer?.lastName ? customer.lastName : '',
        orderCreationTime: order.createdAt,
        orderTotalPrice: convertMoneyToText(order.totalPrice),
        orderTaxedPrice: order.taxedPrice
          ? convertMoneyToText(order.taxedPrice.totalGross)
          : '',
        orderLineItems,
      };

      logger.info(
        `Ready to send order confirmation email of order confirmation : customerEmail=${order.customerEmail}, orderNumber=${orderDetails.orderNumber}, customerMiddleName=${orderDetails.customerMiddleName}, customerCreationTime=${orderDetails.orderCreationTime}`
      );
      await sgMail.send({
        from: senderEmailAddress,
        to: orderDetails.customerEmail,
        templateId,
        subject: "Order Received - " + orderDetails.orderNumber,
        dynamicTemplateData: orderDetails
    }).then(response => console.log(response)).catch(error => console.log(error));
      logger.info(
        `Confirmation email of customer registration has been sent to ${orderDetails.customerEmail}.`
      );
  } 
}
export default OrderConfirmationHandler;
