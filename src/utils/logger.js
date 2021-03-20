import pino from 'pino';

import config from '../config/config.js';

const logger = pino({
    level: config.logLevel,
    prettyPrint: true,
});

export default logger;