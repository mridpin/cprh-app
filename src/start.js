import app from './api/server.js';
import config from './config/config.js';
import logger from './utils/logger.js';

logger.info(`CLIENT ID: ${config.CLIENT_ID}`);
logger.info(`CLIENT SECRET: ${config.CLIENT_SECRET}`);
logger.info(`AUTH: ${config.spotifyAuthClient}`);

app.listen(config.port, () => {
  logger.info(`Server started at http://localhost:${config.port}`);
});