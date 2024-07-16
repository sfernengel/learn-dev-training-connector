import { Type } from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';
import CustomError, { ErrorDetail } from '../errors/custom.error';

export const getTypeByKey = async (key: string): Promise<Type> => {
  const type = await createApiRoot()
    .types()
    .withKey({ key })
    .get()
    .execute()
    .then((response) => response.body);

  return type;
};
