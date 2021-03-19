import base64 from 'base-64';
import utf8 from 'utf8';
import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import SpotifyAPIService from './spotifyAPIservice.js';

// Constants
dotenv.config();
const CLIENT_ID = utf8.encode(process.env.CLIENT_ID);
const CLIENT_SECRET = utf8.encode(process.env.CLIENT_SECRET);
const app = new Express();
const port = process.env.PORT;

export const spotifyAuthUrl = 'https://accounts.spotify.com/api/token';
export const spotifyAuthClient = `Basic ${base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`;

export const spotifySearchUrl = 'https://api.spotify.com/v1/search?';
export const spotifyAlbumsUrl = 'https://api.spotify.com/v1/albums?';

// Configs
app.use(Express.json());
app.use(cors());

// Auth: get token
console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);

// -------------------------- API ENDPOINTS --------------------------
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

/**
 * GET Endpoint. Returns the five most likely matches for the user search parameters
 * Query Params: search = terms to search from Spotify
 */
app.get('/search', (req, res) => {
  let authToken = '';
  SpotifyAPIService.getSpotifyAuthToken(spotifyAuthUrl, spotifyAuthClient)
    .then((authRes) => {
      authToken = authRes.data.access_token;
      // todo: sanitize user input
      // todo: decode %20 spaces
      // todo: check for valid input BEFORE calling spofity auth
      if (req.query.search) {
        SpotifyAPIService.getSpotifySearch(spotifySearchUrl, authToken, req.query.search)
          .then((searchRes) => {
            console.log(`Search query to Spotify successful. Returning ${searchRes.data.albums.items.length} items`);
            res.status(200).send(searchRes.data);
          })
          .catch((err) => {
            console.log(`Spotify Search error => ${err.error.message}`);
            res.status(err.error.status).send(`Spotify Search error => ${err.error.message}`);
          });
      } else {
        console.log('Search parameters are empty. Process aborted');
        res.status(400).send('Search parameters are empty. Process aborted');
      }
    }).catch((err) => {
      console.log(`Spotify Auth error ${err.response.body}`);
      res.status(err.response.status).send(`Spotify Auth error => ${err.response.body}`);
    });
});

/**
 * GET Endpoint. Returns an album from Spotify API
 * Query Params: albumId = album id to search from Spotify
 */
app.get('/albums', (req, res) => {
  // todo: replace this with session var or crypted cookie for authToken
  let authToken = '';
  SpotifyAPIService.getSpotifyAuthToken(spotifyAuthUrl, spotifyAuthClient)
    .then((authRes) => {
      authToken = authRes.data.access_token;
      if (req.query.albumId) {
        SpotifyAPIService.getSpotifyAlbum(spotifyAlbumsUrl, authToken, req.query.albumId)
          .then((albumRes) => {
            if (albumRes.data.albums[0] !== null) {
              const responsePayload = {
                id: albumRes.data.albums[0].id,
                artists: albumRes.data.albums[0].artists,
                copyrights: albumRes.data.albums[0].copyrights,
                images: albumRes.data.albums[0].images[0],
                label: albumRes.data.albums[0].label,
                name: albumRes.data.albums[0].name,
                release_date: albumRes.data.albums[0].release_date,
              };
              console.log('Albums query to Spotify successful. Returning found album');
              res.send(responsePayload);
            } else {
              res.status(404).send('Spotify Album error => Requested album does not exist');
            }
          })
          .catch((err) => {
            console.log(`Spotify Album error => ${err.error.message}`);
            res.status(err.error.status).send(`Spotify Album error => ${err.error.message}`);
          });
      } else {
        console.log('Album ID parameter is empty. Process aborted');
        res.status(400).send('Album ID parameter is empty. Process aborted');
      }
    }).catch((err) => {
      console.log(`Spotify Auth error => ${err}`);
      res.status(err.response.status).send(`Spotify Auth error => ${err.response.body}`);
    });
});

// -------------------------- EXPORTS -------------------------- 

export default app;
export const Port = port;