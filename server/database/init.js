const db = require('./config');
const path = require('path');
const fs = require('fs');

/**
 * Initialize the database by running migrations
 */
async function initializeDatabase() {
  console.log('Checking database...');
  
  // Define database file path
  const dbFilePath = path.join(__dirname, 'mychords.sqlite3');
  
  // Create tables if they don't exist
  try {
    // Check if artists table exists
    const artistTableExists = await db.schema.hasTable('artists');
    if (!artistTableExists) {
      console.log('Creating artists table...');
      await db.schema.createTable('artists', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('info');
        table.string('imageUrl');
        table.timestamps(true, true);
      });
      console.log('Artists table created successfully');
    } else {
      console.log('Artists table already exists');
    }

    // Check if songs table exists
    const songTableExists = await db.schema.hasTable('songs');
    if (!songTableExists) {
      console.log('Creating songs table...');
      await db.schema.createTable('songs', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.integer('artistId').unsigned().references('id').inTable('artists').onDelete('CASCADE');
        table.enum('type', ['chord', 'tab']).notNullable();
        table.text('content').notNullable();
        table.timestamps(true, true);
      });
      console.log('Songs table created successfully');
    } else {
      console.log('Songs table already exists');
    }

    // Add some sample data if database is empty
    const artistCount = await db('artists').count('* as count').first();
    if (artistCount && artistCount.count === 0) {
      console.log('Adding sample data...');
      
      // Add a sample artist
      const [artistId] = await db('artists').insert({
        name: 'Sample Artist',
        info: 'This is a sample artist added during database initialization',
        created_at: new Date(),
        updated_at: new Date()
      });
      
      // Add sample chord sheet
      await db('songs').insert({
        title: 'Sample Chord Sheet',
        artistId: artistId,
        type: 'chord',
        content: `G                  C              G
This is a sample chord sheet for testing
Em                  D               G
You can transpose and autoscroll this content

G       C        G
Verse 1
Em      D        G
Sample lyrics here`,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      // Add sample tab
      await db('songs').insert({
        title: 'Sample Tab',
        artistId: artistId,
        type: 'tab',
        content: `e|---0---0---0---0---|
B|---1---1---1---1---|
G|---0---0---0---0---|
D|---2---2---2---2---|
A|---3---3---3---3---|
E|------------------|

e|---3---3---3---3---|
B|---0---0---0---0---|
G|---0---0---0---0---|
D|---0---0---0---0---|
A|---2---2---2---2---|
E|---3---3---3---3---|`,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      console.log('Sample data added successfully');
    }
    
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

module.exports = initializeDatabase; 