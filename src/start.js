import Express from 'express';
import config from './config/config.js';
import logger from './utils/logger.js';
import router from './api-routes/router.js';
import cors from 'cors';

// Constants
const app = new Express();

// Configs
app.use(Express.json());
app.use(cors());

// add routes
app.use('/api', router);

// test endpoint
app.get('/', (req, res) => res.send('app is working!'));

// server listen
app.listen(config.port, () => logger.info(`Server started at http://localhost:${config.port}`));

export default app;