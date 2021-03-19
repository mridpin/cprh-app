import app from './server.js';
import { Port } from './server.js';

app.listen(Port, () => {
  console.log(`Server started at http://localhost:${Port}`);
});