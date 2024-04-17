import {
  HANDLER_TYPE_ORDER_CONFIRMATION
} from '../constants/handler-type.constants.js';
import OrderConfirmationHandler from '../handlers/order-confirmation.handler.js';

class HandlerFactory {
  constructor() {}
  getHandler(handlerType: string) {
    if (HANDLER_TYPE_ORDER_CONFIRMATION === handlerType) {
      return new OrderConfirmationHandler();
    }
  }
}
export default HandlerFactory;
