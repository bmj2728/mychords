const express = require('express');
const router = express.Router();
const fileService = require('../services/fileService');

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await fileService.getArtists();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get songs by artist
router.get('/:artistId/songs', async (req, res) => {
  try {
    const { artistId } = req.params;
    const songs = await fileService.getSongsByArtist(artistId);
    
    if (songs.length === 0) {
      return res.status(404).json({ message: 'Artist not found or has no songs' });
    }
    
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 