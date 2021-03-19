import axios from 'axios';
import qs from 'qs';

export default class SpotifyAPIService {
  /**
   * Perform a GET auth token to access Spotify API.
   * Returns a Promise with the response
   */
  static async getSpotifyAuthToken(spotifyAuthUrl, spotifyAuthClient) {
    const data = qs.stringify({
      grant_type: 'client_credentials',
    });
    const config = {
      method: 'post',
      url: spotifyAuthUrl,
      headers: {
        Authorization: spotifyAuthClient,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    };
    return await axios(config);
  }

  /**
   * Perform a GET search results from Spotify API.
   * Returns a Promise with the response
   */
  static async getSpotifySearch(spotifySearchUrl, authToken, searchQuery) {
    const url = `${spotifySearchUrl}q=${searchQuery}&type=album&limit=5`;
    const config = {
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    };
    return await axios(config);
  }

  /**
   * Perform a GET auth token to access Spotify API.
   * Returns a Promise with the response
   */
  static async getSpotifyAlbum(spotifyAlbumsUrl, authToken, albumId) {
    const url = `${spotifyAlbumsUrl}ids=${albumId}`;
    const config = {
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    };
    return await axios(config);
  }
}
