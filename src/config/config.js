import dotenv from 'dotenv'
import utf8 from 'utf8';
import base64 from 'base-64';

dotenv.config();
const CLIENT_ID = utf8.encode(process.env.CLIENT_ID);
const CLIENT_SECRET = utf8.encode(process.env.CLIENT_SECRET);

const config = {
    port: process.env.PORT,

    spotifyAuthUrl: 'https://accounts.spotify.com/api/token',
    spotifyAuthClient: `Basic ${base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    spotifySearchUrl: 'https://api.spotify.com/v1/search?',
    spotifyAlbumsUrl: 'https://api.spotify.com/v1/albums?',
};

export default config;