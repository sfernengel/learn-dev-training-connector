import CustomError from '../errors/custom.error.js';
import envValidators from '../validators/env.validators.js';
import { getValidateMessages } from '../validators/helpers.validators.js';

/**
 * Read the configuration env vars
 * (Add yours accordingly)
 *
 * @returns The configuration with the correct env vars
 */

export const readConfiguration = () => {
  const envVars = {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
    projectKey: process.env.CTP_PROJECT_KEY as string,
    region: process.env.CTP_REGION as string,
    senderEmailAddress: process.env.SENDER_EMAIL_ADDRESS as string,
    templateId: process.env.ORDER_CONFIRMATION_TEMPLATE_ID as string,
    sgMailApiKey: process.env.EMAIL_PROVIDER_API_KEY as string
  };

  const validationErrors = getValidateMessages(envValidators, envVars);

  if (validationErrors.length) {
    throw new CustomError(
      'InvalidEnvironmentVariablesError',
      'Invalid Environment Variables please check your .env file',
      validationErrors
    );
  }

  return envVars;
}
