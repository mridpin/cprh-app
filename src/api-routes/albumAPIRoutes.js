import Express from 'express';
import cors from 'cors';

import SpotifyAPIService from '../utils/spotifyAPIservice.js';
import config from '../config/config.js';
import logger from '../utils/logger.js';

// Constants
const app = new Express();

// Configs
app.use(Express.json());
app.use(cors());

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
  SpotifyAPIService.getSpotifyAuthToken(config.spotifyAuthUrl, config.spotifyAuthClient)
    .then((authRes) => {
      authToken = authRes.data.access_token;
      // todo: sanitize user input
      // todo: decode %20 spaces
      // todo: check for valid input BEFORE calling spofity auth
      if (req.query.search) {
        SpotifyAPIService.getSpotifySearch(config.spotifySearchUrl, authToken, req.query.search)
          .then((searchRes) => {
            logger.info(`Search query to Spotify successful. Returning ${searchRes.data.albums.items.length} items`);
            res.status(200).send(searchRes.data);
          })
          .catch((err) => {
            logger.error(`Spotify Search error => ${err.error.message}`);
            res.status(err.error.status).send(`Spotify Search error => ${err.error.message}`);
          });
      } else {
        logger.info('Search parameters are empty. Process aborted');
        res.status(400).send('Search parameters are empty. Process aborted');
      }
    }).catch((err) => {
      logger.error(`Spotify Auth error => ${err}`);
      res.status(500).send(`Could not connect to Spotify API, please try again later or contact site admin`);
    });
});

/**
 * GET Endpoint. Returns an album from Spotify API
 * Query Params: albumId = album id to search from Spotify
 */
app.get('/albums', (req, res) => {
  // todo: replace this with session var or crypted cookie for authToken
  let authToken = '';
  SpotifyAPIService.getSpotifyAuthToken(config.spotifyAuthUrl, config.spotifyAuthClient)
    .then((authRes) => {
      authToken = authRes.data.access_token;
      if (req.query.albumId) {
        SpotifyAPIService.getSpotifyAlbum(config.spotifyAlbumsUrl, authToken, req.query.albumId)
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
              logger.info('Albums query to Spotify successful. Returning found album');
              res.send(responsePayload);
            } else {
              logger.info('Spotify Album error => Requested album does not exist');
              res.status(404).send('Spotify Album error => Requested album does not exist');
            }
          })
          .catch((err) => {
            logger.error(`Spotify Album error => ${err.error.message}`);
            res.status(err.error.status).send(`Spotify Album error => ${err.error.message}`);
          });
      } else {
        logger.info('Album ID parameter is empty. Process aborted');
        res.status(400).send('Album ID parameter is empty. Process aborted');
      }
    }).catch((err) => {
      logger.error(`Spotify Auth error => ${err}`);
      res.status(500).send(`Could not connect to Spotify API, please try again later or contact site admin`);
    });
});

// -------------------------- EXPORTS -------------------------- 
export default app;