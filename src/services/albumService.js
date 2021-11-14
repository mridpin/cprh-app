import { AlbumAdapter } from '../models/album.js';
import AlbumQueryModel from '../models/album.js';
import logger from '../utils/logger.js';

/**
 * stores payload in database and returns it as an Album object
 * @param {*} payload response from spotify api
 * @returns album as Album
 */
const createAlbum = async (payload) => {
  const album = AlbumAdapter.adapt(payload);
  // store album in db
  const albumQuery = new AlbumQueryModel({
    spotifyId: album.id,
    name: album.name,
    releaseDate: album.releaseDate,
    copyright: album.copyrights[0].text,
  });
  try {
    await albumQuery.save();
  } catch (err) {
    // if mongo errors due to duplicate key, it does not matter for the user experience
    logger.error(`Mongo Error => ${err}`);
  }
  return album;
};

/**
 * returns how many albums each copyright holder has
 * @returns list of {copyright: string, count: number}
 * https://stackoverflow.com/a/23116396/11829823
 */
const getStats = async () => {
  const aggregatorOpts = [
    {
      $group: {
        _id: '$copyright',
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1,
      },
    },
  ];
  return AlbumQueryModel.aggregate(aggregatorOpts);
};

export default {
  createAlbum,
  getStats,
};
