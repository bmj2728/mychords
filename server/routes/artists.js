const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const Song = require('../models/Song');

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.getAll();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.getById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all songs by artist ID
router.get('/:artistId/songs', async (req, res) => {
  try {
    const songs = await Song.getAll({ artistId: req.params.artistId });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new artist
router.post('/', async (req, res) => {
  try {
    const { name, info, imageUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Artist name is required' });
    }
    
    const artistId = await Artist.create({ name, info, imageUrl });
    res.status(201).json({ id: artistId, name, info, imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update artist
router.put('/:id', async (req, res) => {
  try {
    const { name, info, imageUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Artist name is required' });
    }
    
    const artist = await Artist.getById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    await Artist.update(req.params.id, { name, info, imageUrl });
    res.json({ id: req.params.id, name, info, imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete artist
router.delete('/:id', async (req, res) => {
  try {
    const artist = await Artist.getById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    await Artist.delete(req.params.id);
    res.json({ message: 'Artist deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 