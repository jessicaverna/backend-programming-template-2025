const { env, port } = require('./core/config');
const logger = require('./core/logger')('app');
const server = require('./core/server');
const gachaService = require('./api/components/gacha/gacha-service');

const app = server.listen(port, async (err) => {
  if (err) {
    logger.fatal(err, 'Failed to start the server.');
    process.exit(1);
  } else {
    logger.info(`Server runs at port ${port} in ${env} environment`);

    // Initialize gacha prizes in the database
    try {
      await gachaService.initializePrizes();
      logger.info('Gacha prizes initialized successfully');
    } catch (initErr) {
      logger.error(initErr, 'Failed to initialize gacha prizes');
    }
  }
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught exception.');

  // Shutdown the server gracefully
  app.close(() => process.exit(1));

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => process.abort(), 1000).unref();
  process.exit(1);
});
