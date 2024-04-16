import { Request, Response } from 'express';
import { post } from './service.controller';
import { apiSuccess } from '../api/success.api';
import { orderController } from './order.controller';

jest.mock('../api/success.api', () => ({
  apiSuccess: jest.fn(),
}));
jest.mock('./order.controller',() => ({
  orderController: jest.fn(),
}));

describe('./service.controller', () => {
    let req: Request;
    let res: Response;

  beforeEach(() => {
    req = {
      body: {
        action: 'Create',
        resource: {
          typeId: 'order'
        }
      }
    } as Request;
    res = {
      statusCode: 200,
      json: jest.fn()
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a valid request', async () => {
    const mockData = { statusCode: 200, actions: 'mockActions' };
    (orderController as jest.Mock).mockResolvedValue(mockData);

    await post(req as Request, res as Response);

    expect(orderController).toHaveBeenCalledWith('Create', { typeId: 'order' });
    expect(apiSuccess).toHaveBeenCalledWith(200, 'mockActions', res);
    expect(res.statusCode).toBe(200);
  });
});