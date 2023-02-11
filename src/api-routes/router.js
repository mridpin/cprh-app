import express from 'express';
import albumController from './controllers/album.controller.js';

// const { blogpost } = require('../controllers')

const router = express.Router()

router.get('/search', albumController.searchAlbums);
router.get('/albums', albumController.getAlbum);

export default router;