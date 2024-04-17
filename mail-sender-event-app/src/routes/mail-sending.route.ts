import { Router } from 'express';

import { messageHandler } from '../controllers/mail-sending.controller.js';
const eventRouter = Router();

eventRouter.post('/', async (req, res) => {
  await messageHandler(req, res);
  res.status(200);
  res.send();
});

export default eventRouter;
