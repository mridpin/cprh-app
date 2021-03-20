import app from './api/server.js';
import config from './config/config.js';

app.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});