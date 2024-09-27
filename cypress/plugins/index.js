const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    // Start the proxy server
    const proxy = require('http-proxy-middleware');
    launchOptions.args.push('--proxy-server=http://localhost:3000'); // Change port as per your setup
    return launchOptions;
  });

  // Add other tasks or configurations if needed

  return config;
};