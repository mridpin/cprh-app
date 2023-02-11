import { AlbumAdapter } from '../models/album.js';
import AlbumQueryModel from '../models/album.js';
import logger from '../utils/logger.js';

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
  getStats
};
