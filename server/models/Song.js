const db = require('../database/config');

const Song = {
  // Get all songs with optional filtering
  getAll: async (filter = {}) => {
    const query = db('songs').select('*');
    
    // Apply filters if provided
    if (filter.artistId) {
      query.where('artistId', filter.artistId);
    }
    
    if (filter.type) {
      query.where('type', filter.type);
    }
    
    return query.orderBy('title');
  },

  // Get song by ID
  getById: async (id) => {
    return db('songs').where({ id }).first();
  },

  // Create new song
  create: async (songData) => {
    const [id] = await db('songs').insert(songData);
    return id;
  },

  // Update song
  update: async (id, songData) => {
    return db('songs').where({ id }).update(songData);
  },

  // Delete song
  delete: async (id) => {
    return db('songs').where({ id }).del();
  },
  
  // Search songs by title or artist name
  search: async (searchTerm) => {
    return db('songs')
      .join('artists', 'songs.artistId', '=', 'artists.id')
      .select(
        'songs.id',
        'songs.title',
        'songs.type',
        'artists.id as artistId',
        'artists.name as artistName'
      )
      .where('songs.title', 'like', `%${searchTerm}%`)
      .orWhere('artists.name', 'like', `%${searchTerm}%`)
      .orderBy('songs.title');
  }
};

module.exports = Song; 