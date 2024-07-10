import { HttpErrorType } from "@commercetools/sdk-client-v2";

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

export function isHttpError(error: any): error is HttpErrorType {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof error.name === 'string' &&
    typeof error.message === 'string' &&
    typeof error.code === 'number' &&
    typeof error.status === 'number' &&
    typeof error.statusCode === 'number' &&
    typeof error.body === 'object'
  );
}
