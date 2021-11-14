import Express from 'express';
import config from './config/config.js';
import logger from './utils/logger.js';
import router from './api-routes/router.js';
import cors from 'cors';
import mongoose from 'mongoose';

// Constants
const app = new Express();

// Configs
app.use(Express.json());
app.use(cors());

// database
const mongoUrl = `mongodb://${config.mongodb_root}:${config.mongodb_pass}@${config.mongodb_uri}`;
mongoose.connect(mongoUrl)
  .then((res) => {
    logger.info(`MongoDB instance started at http://localhost:${config.mongodb_port}`)
  })
  .catch((error) => {
    logger.error(`Error creating Mongo instance: ${error}`);
    process.exit(1);
  });

// add routes
app.use('/api', router);

// test endpoint
app.get('/', (req, res) => res.send('app is working!'));

// server listen
app.listen(config.port, () => logger.info(`Server started at http://localhost:${config.port}`));

export default app;