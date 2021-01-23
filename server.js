import base64 from 'base-64'; 
import utf8 from 'utf8';

// Constants
const CLIENT_ID = utf8.encode(process.env.CLIENT_ID);
const CLIENT_SECRET = utf8.encode(process.env.CLIENT_SECRET);

// Auth: get token
console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);
