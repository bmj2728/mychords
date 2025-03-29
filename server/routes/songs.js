const express = require('express');
const router = express.Router();
const fileService = require('../services/fileService');
const path = require('path');
const crypto = require('crypto');

// Get all songs with optional format filter
router.get('/', async (req, res) => {
  try {
    const { format } = req.query;
    const songs = await fileService.getAllSongs(format);
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
    
    const songs = await fileService.searchSongs(q);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get song by ID and format
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    
    console.log(`Received request for song: ${id} with format: ${format}`);
    
    // Format is required for file lookup
    if (!format) {
      console.log('No format provided in the request');
      return res.status(400).json({ message: 'Format parameter is required (chordpro or plaintext)' });
    }
    
    const song = await fileService.getSongById(id, format);
    if (!song) {
      console.log(`Song not found: ${id} with format: ${format}`);
      return res.status(404).json({ message: 'Song not found' });
    }
    
    console.log(`Successfully retrieved song: ${id}`);
    res.json(song);
  } catch (err) {
    console.error(`Error getting song:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new song
router.post('/', async (req, res) => {
  try {
    const { title, content, format } = req.body;
    
    // Validate required fields
    if (!title || !content || !format) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'content', 'format']
      });
    }
    
    // Validate format is 'chordpro' or 'plaintext'
    if (format !== 'chordpro' && format !== 'plaintext') {
      return res.status(400).json({ 
        message: 'Format must be "chordpro" or "plaintext"'
      });
    }
    
    // Create a unique ID based on the title
    const id = await fileService.createSongId(title, format);
    
    // Save the song
    const savedSong = await fileService.saveSong(id, format, content);
    
    res.status(201).json(savedSong);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update song
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, format } = req.body;
    
    // Validate required fields
    if (!content || !format) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['content', 'format']
      });
    }
    
    // Validate format is 'chordpro' or 'plaintext'
    if (format !== 'chordpro' && format !== 'plaintext') {
      return res.status(400).json({ 
        message: 'Format must be "chordpro" or "plaintext"'
      });
    }
    
    // Check if song exists
    const existingSong = await fileService.getSongById(id, format);
    if (!existingSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Update the song
    const updatedSong = await fileService.saveSong(id, format, content);
    
    res.json(updatedSong);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete song
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    
    // Format is required for file deletion
    if (!format) {
      return res.status(400).json({ message: 'Format parameter is required (chordpro or plaintext)' });
    }
    
    const result = await fileService.deleteSong(id, format);
    if (!result) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 