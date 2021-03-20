import app from './api/server.js';
import config from './config/config.js';
import logger from './utils/logger.js';

app.listen(config.port, () => {
  logger.info(`Server started at http://localhost:${config.port}`);
});