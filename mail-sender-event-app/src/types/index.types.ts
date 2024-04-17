export type item = {
    productName: string;
    productQuantity: number;
    productSku: string | undefined;
    productSubTotal: string;
};

export type Message = {
    code: string;
    message: string;
    referencedBy: string;
  };
  
  export type ValidatorCreator = (
    path: string[],
    message: Message,
    overrideConfig?: object
  ) => [string[], [[(o: object) => boolean, string, [object]]]];
  
  export type ValidatorFunction = (o: object) => boolean;
  
  export type Wrapper = (
    validator: ValidatorFunction
  ) => (value: object) => boolean;
  