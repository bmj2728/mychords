const db = require('../database/config');

const Artist = {
  // Get all artists
  getAll: async () => {
    return db('artists').select('*').orderBy('name');
  },

  // Get artist by ID
  getById: async (id) => {
    return db('artists').where({ id }).first();
  },

  // Create new artist
  create: async (artistData) => {
    const [id] = await db('artists').insert(artistData);
    return id;
  },

  // Update artist
  update: async (id, artistData) => {
    return db('artists').where({ id }).update(artistData);
  },

  // Delete artist
  delete: async (id) => {
    return db('artists').where({ id }).del();
  }
};

module.exports = Artist; 