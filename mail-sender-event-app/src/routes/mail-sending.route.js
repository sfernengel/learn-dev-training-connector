import { Router } from 'express';

import { messageHandler } from '../controllers/mail-sending.controller.js';
const eventRouter = Router();

eventRouter.post(
  '/mailSenderEvent',

  messageHandler
);

export default eventRouter;
