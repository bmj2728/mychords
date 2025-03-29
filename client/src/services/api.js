import axios from 'axios';

// Create an axios instance with common config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Artist API services
export const artistService = {
  // Get all artists
  getAllArtists: () => api.get('/artists'),
  
  // Get artist by ID
  getArtistById: (id) => api.get(`/artists/${id}`),
  
  // Create new artist
  createArtist: (artistData) => api.post('/artists', artistData),
  
  // Update artist
  updateArtist: (id, artistData) => api.put(`/artists/${id}`, artistData),
  
  // Delete artist
  deleteArtist: (id) => api.delete(`/artists/${id}`),
  
  // Get all songs by artist
  getArtistSongs: (artistId) => api.get(`/artists/${artistId}/songs`),
};

// Song API services
export const songService = {
  // Get all songs with optional filtering
  getAllSongs: (params) => api.get('/songs', { params }),
  
  // Search songs
  searchSongs: (query) => api.get('/songs/search', { params: { q: query } }),
  
  // Get song by ID
  getSongById: (id) => api.get(`/songs/${id}`),
  
  // Create new song
  createSong: (songData) => api.post('/songs', songData),
  
  // Update song
  updateSong: (id, songData) => api.put(`/songs/${id}`, songData),
  
  // Delete song
  deleteSong: (id) => api.delete(`/songs/${id}`),
};

export default {
  artistService,
  songService,
}; 