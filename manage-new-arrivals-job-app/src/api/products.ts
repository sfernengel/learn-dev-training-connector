import { createApiRoot } from '../client/create.client';


export const getProductsByQuery = async(filterQuery:string[]) =>{
  const {body} = await createApiRoot()
  .productProjections()
  .search()
  .get({
    queryArgs: {
      "filter.query": filterQuery,
      limit: 100,
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
        actions: [{
          action: "removeFromCategory",
          category: {
            typeId: "category",
            id: categoryId,
          },
          staged:false
        }],
      },
    })
    .execute();
    return body; 
};

export const addCategoryToProductById = async(productId: string, productVersion: number, categoryId: string) => {
    const {body} = await createApiRoot()
            .products()
            .withId({ID: productId})
            .post({
                body: {
                    version: productVersion,
                    actions: [{
                      action: "addToCategory",
                      category: {typeId: "category", id: categoryId},
                      staged:false
                    }]
                }
            })
            .execute();
    return body; 
};