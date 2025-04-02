const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Video Stream (MJPEG/WebSocket)
  app.use(
    '/stream',
    createProxyMiddleware({
      target: 'http://192.168.125.55', // ESP32-CAM IP
      changeOrigin: true,
      ws: true,
      logLevel: 'debug'
    })
  );

  // Still Image Capture
  app.use(
    '/capture',
    createProxyMiddleware({
      target: 'http://192.168.125.55',
      changeOrigin: true
    })
  );

  // Camera Control Endpoints
  app.use(
    '/control',
    createProxyMiddleware({
      target: 'http://192.168.125.55',
      changeOrigin: true
    })
  );
};