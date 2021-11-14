import { AlbumAdapter } from "../models/album.js"

/**
 * stores payload in database and returns it as an Album object
 * @param {*} payload response from spotify api
 * @returns album as Album
 */
const createAlbum = async (payload) => {
    const album = AlbumAdapter.adapt(payload);
    // todo: store album in db
    return album;
}

export default {
    createAlbum
}