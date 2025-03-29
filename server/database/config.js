const path = require('path');

// Configure Knex with SQLite
const dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'mychords.sqlite3')
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      // Enable foreign keys in SQLite
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  }
};

module.exports = require('knex')(dbConfig); 