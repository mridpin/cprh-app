import SpotifyAPIService from '../../utils/spotifyAPIservice.js';
import config from '../../config/config.js';
import logger from '../../utils/logger.js';
import albumService from '../../services/albumService.js';


/**
 * GET Endpoint. Returns the five most likely matches for the user search parameters
 * Query Params: search = terms to search from Spotify
 */
const searchAlbums = async (req, res) => {
  // todo: sanitize user input
  // todo: decode %20 spaces
  // todo: check for valid input BEFORE calling spofity auth
  if (!req.query.search) {
    logger.info('Search parameters are empty. Process aborted');
    return res.status(400).send('Search parameters are empty. Process aborted');
  }
  try {
    const authToken = await SpotifyAPIService.getSpotifyAuthToken(config.spotifyAuthUrl, config.spotifyAuthClient);
    try {
      const searchRes = await SpotifyAPIService.getSpotifySearch(config.spotifySearchUrl, authToken.data.access_token, req.query.search);
      logger.info(`Search query to Spotify successful. Returning ${searchRes.data.albums.items.length} items`);
      return res.status(200).send(searchRes.data);
    } catch (err) {
      logger.error(`Spotify Search error => ${err.response.data.error.message}`);
      return res.status(err.response.data.error.status).send(`Spotify Search error => ${err.response.data.error.message}`);
    }
  } catch (err) {
    logger.error(`Spotify Auth error => ${err}`);
    return res.status(500).send(`Could not connect to Spotify API, please try again later or contact site admin`);
  }
}

/**
 * GET Endpoint. Returns an album from Spotify API
 * Query Params: albumId = album id to search from Spotify
 */
const getAlbum = async (req, res) => {
  // todo: replace this with session var or crypted cookie for authToken
  if (!req.query.albumId) {
    logger.info('Album ID parameter is empty. Process aborted');
    return res.status(400).send('Album ID parameter is empty. Process aborted');
  }
  try {
    const authToken = await SpotifyAPIService.getSpotifyAuthToken(config.spotifyAuthUrl, config.spotifyAuthClient);
    try {
      const albumRes = await SpotifyAPIService.getSpotifyAlbum(config.spotifyAlbumsUrl, authToken.data.access_token, req.query.albumId);
      if (albumRes.data.albums[0] !== null) {
        const album = await albumService.createAlbum(albumRes.data);
        logger.info('Albums query to Spotify successful. Returning found album');
        return res.send(album);
      } else {
        logger.info('Spotify Album error => Requested album does not exist');
        return res.status(404).send('Spotify Album error => Requested album does not exist');
      }
    } catch (err) {
      logger.error(`Spotify Album error => ${err.response.data.error.message}`);
      return res.status(err.response.data.error.status).send(`Spotify Album error => ${err.response.data.error.message}`);
    }
  } catch (err) {
    logger.error(`Spotify Auth error => ${err}`);
    return res.status(500).send(`Could not connect to Spotify API, please try again later or contact site admin`);
  }
}

export default {
  searchAlbums,
  getAlbum
};