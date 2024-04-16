import { ClientResponse, ProductPagedQueryResponse, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';

import { createApiRoot } from '../client/create.client';
import { logger } from '../utils/logger.utils';
import { response } from 'express';


export const getProductsInCategory = async(filterQuery:string[]) =>{
  const {body} = await createApiRoot()
  .productProjections()
  .search()
  .get({
    queryArgs: {
      "filter.query": filterQuery,
      limit: 500,
    },
  })
  .execute();
  return body; 
}

export const removeCategoryFromProduct = async(
  productId: string,
  productVersion: number,
  categoryId: string
)=>{
  const {body} =  await createApiRoot()
    .products()
    .withId({ ID: productId })
    .post({
      body: {
        version: productVersion,
        actions: [
          {
            action: "removeFromCategory",
            category: {
              typeId: "category",
              id: categoryId,
            },
            staged:false
          },
        ],
      },
    })
    .execute();
    logger.info(`Removing: ${productId}`)
    return body; 
};

export const getProductById = async(productId: string) => {
    return await createApiRoot()
      .productProjections()
      .withId({ ID: productId })
      .get()
      .execute();
};

export const getProductsPublishedInMinutes = async(minutes: number) => {
  const tenMinutesAgo = new Date(Date.now() - minutes * 60 * 1000);
  return await createApiRoot()
    .productProjections()
    .get({
      queryArgs: {
        staged: false,
        where: `lastModifiedAt > "${tenMinutesAgo.toISOString}"`,
        sort: 'lastModifiedAt desc',
        limit: 100
      }
    })
    .execute().then((response) => response.body.results)
};

export const addCategoryToProductById = async(productId: string, categoryId: string) => {
    return getProductById(productId).then(({body}) => {
        return createApiRoot()
            .products()
            .withId({ID: productId})
            .post({
                body: {
                    version: body.version,
                    actions: [{
                    action: "addToCategory",
                    category: {typeId: "category", id: categoryId}
                    },
                    {
                    action: "publish"    
                    }]
                }
            })
            .execute();
        });
};