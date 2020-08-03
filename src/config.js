/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */


const config = {};

// API Gateway
config.api = {
  server: 'http://51.15.250.32',
  transportUrl: 'ws://127.0.0.1:8888/',
  faucetUrl: 'https://wallet.test.apollowallet.org',
};

config.api.serverUrl = `${config.api.server}/apl?`;

module.exports = config;
