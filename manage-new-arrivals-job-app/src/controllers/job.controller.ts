import { Request, Response } from 'express';

import { readConfiguration } from '../utils/config.utils';
import CustomError from '../errors/custom.error';
import { logger } from '../utils/logger.utils';
import { addCategoryToProductById, getProductsByQuery, removeCategoryFromProduct } from '../api/products';
import { getCategoryByKey } from '../api/categories';

/**
 * Exposed job endpoint.
 *
 * @param {Request} _request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (_request: Request, response: Response) => {
  try {
    // Get the Products
    logger.info(`Running job to remove Products from Category.`);

    const categoryKey:string =readConfiguration().categoryKey;
    const categoryId: string = await getCategoryByKey(categoryKey).then(({body}) => body.id);
                                  
    const today = new Date();
    const toDate = new Date(new Date().setDate(today.getDate() - 30));

    // Filter query used by Product Projection Search
    const oldProductsFilterQuery:string[] = [
      `categories.id:"${categoryId}"`,
      `createdAt:range (* to "${toDate.toISOString()}")`,
    ]
    
    const oldProductsInCategory = await getProductsByQuery(oldProductsFilterQuery);

    for (const product of oldProductsInCategory.results)
    {
      await removeCategoryFromProduct(product.id, product.version, categoryId);
    }

    logger.info(`Finished removing Products created before ${toDate.toDateString()} in category: ${categoryId}`);

    const tenMinutesAgo = new Date(Date.now() - 11 * 60 * 1000);
    const now = new Date(Date.now());
    
    const newProductsFilterQuery:string[] = [
      `lastModifiedAt:range ("${tenMinutesAgo.toISOString()}" to "${now.toISOString()}")`,
      `createdAt:range ("${toDate.toISOString()}" to "${now.toISOString()}")`,
    ]
    logger.info("Running job to add new Products to the new arrivals Category.");
    
    const newProductsNotInCategory = await getProductsByQuery(newProductsFilterQuery);

    if (newProductsNotInCategory.count >0) {
      for (const product of newProductsNotInCategory.results)
      {
        if (product.categories?.find(category => category.id === categoryId) == undefined){
          await addCategoryToProductById(product.id, product.version, categoryId);
        }
      }
    }
    
    logger.info(`Finished adding new products created in the category: ${categoryId}`);
    
    response.status(200).send();
  
  } catch (error) {
    throw new CustomError(
      500,
      `Internal Server Error - Error retrieving all products from the commercetools SDK`
    );
  }
};