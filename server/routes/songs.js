const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const Artist = require('../models/Artist');

// Get all songs with optional filtering
router.get('/', async (req, res) => {
  try {
    const { artistId, type } = req.query;
    const songs = await Song.getAll({ artistId, type });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Search songs
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    const songs = await Song.search(q);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.getById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Get artist information for the song
    const artist = await Artist.getById(song.artistId);
    
    res.json({
      ...song,
      artist: artist || { id: song.artistId }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new song
router.post('/', async (req, res) => {
  try {
    const { title, artistId, type, content } = req.body;
    
    // Validate required fields
    if (!title || !artistId || !type || !content) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'artistId', 'type', 'content']
      });
    }
    
    // Validate type is 'chord' or 'tab'
    if (type !== 'chord' && type !== 'tab') {
      return res.status(400).json({ 
        message: 'Type must be "chord" or "tab"'
      });
    }
    
    // Check if artist exists
    const artist = await Artist.getById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const songId = await Song.create({ title, artistId, type, content });
    res.status(201).json({ 
      id: songId, 
      title, 
      artistId, 
      type, 
      content,
      artist: {
        id: artist.id,
        name: artist.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update song
router.put('/:id', async (req, res) => {
  try {
    const { title, artistId, type, content } = req.body;
    
    // Validate required fields
    if (!title || !artistId || !type || !content) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'artistId', 'type', 'content']
      });
    }
    
    // Validate type is 'chord' or 'tab'
    if (type !== 'chord' && type !== 'tab') {
      return res.status(400).json({ 
        message: 'Type must be "chord" or "tab"'
      });
    }
    
    // Check if song exists
    const song = await Song.getById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Check if artist exists
    const artist = await Artist.getById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    await Song.update(req.params.id, { title, artistId, type, content });
    res.json({ 
      id: req.params.id, 
      title, 
      artistId, 
      type, 
      content,
      artist: {
        id: artist.id,
        name: artist.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete song
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.getById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    await Song.delete(req.params.id);
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 