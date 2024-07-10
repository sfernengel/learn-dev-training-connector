import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { post } from '../controllers/service.controller';

const serviceRouter = Router();

serviceRouter.post('/', async (req, res, next) => {
  {
    try {
      await post(req, res);
      logger.info('Order createngrok http extension executed', res.statusMessage);
    } catch (error) {
      next(error);
    }
  }
});

export default serviceRouter;
