import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Export song-related API services
export const songService = {
  // Get all songs
  getAllSongs: (format) => {
    return api.get('/songs', { params: { format } });
  },
  
  // Get song by ID
  getSongById: (id, format) => {
    return api.get(`/songs/${id}`, { params: { format } });
  },
  
  // Search songs
  searchSongs: (searchTerm) => {
    return api.get(`/songs/search`, { params: { q: searchTerm } });
  },
  
  // Create new song
  createSong: (songData) => {
    return api.post('/songs', songData);
  },
  
  // Update song
  updateSong: (id, songData) => {
    return api.put(`/songs/${id}`, songData);
  },
  
  // Delete song
  deleteSong: (id, format) => {
    return api.delete(`/songs/${id}`, { params: { format } });
  }
};

// Export artist-related API services
export const artistService = {
  // Get all artists
  getAllArtists: () => {
    return api.get('/artists');
  },
  
  // Get songs by artist
  getSongsByArtist: (artistId) => {
    return api.get(`/artists/${artistId}/songs`);
  }
};

export default {
  songService,
  artistService
}; 