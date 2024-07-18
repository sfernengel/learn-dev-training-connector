import { Router } from 'express';

import { messageHandler } from '../controllers/mail-sending.controller.js';
const eventRouter = Router();

eventRouter.post('/', async (req, res, next) => {
  console.log('A request has been received');
  try {
    await messageHandler(req, res);
  } catch (error) {
    next(error);
  }
});

export default eventRouter;
