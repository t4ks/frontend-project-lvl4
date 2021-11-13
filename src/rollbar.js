// same configuration you would create for the Rollbar.js SDK
// eslint-disable-next-line import/prefer-default-export
export const rollbarConfig = {
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV,
  code_version: '0.0.1',
  captureUncaught: true,
  captureUnhandledRejections: true,
};
