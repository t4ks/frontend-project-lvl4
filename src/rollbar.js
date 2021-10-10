import Rollbar from 'rollbar';


// same configuration you would create for the Rollbar.js SDK
export const rollbarConfig = {
  accessToken: 'a44e4960d1e8495590dc41e5e68f1232',
  environment: 'development',
  // server: {
  //     root: "http://0.0.0.0:5000/",
  //     branch: "main"
  //   },
  code_version: "0.0.1",
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export const rollbarInstance = new Rollbar(rollbarConfig);


