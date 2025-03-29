const db = require('../config');

async function createTables() {
  // Check if tables already exist
  const artistTableExists = await db.schema.hasTable('artists');
  const songTableExists = await db.schema.hasTable('songs');

  if (!artistTableExists) {
    // Create artists table
    await db.schema.createTable('artists', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('info');
      table.string('imageUrl');
      table.timestamps(true, true);
    });
    console.log('Artists table created');
  }

  if (!songTableExists) {
    // Create songs table
    await db.schema.createTable('songs', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.integer('artistId').unsigned().references('id').inTable('artists').onDelete('CASCADE');
      table.enum('type', ['chord', 'tab']).notNullable();
      table.text('content').notNullable();
      table.timestamps(true, true);
    });
    console.log('Songs table created');
  }
}

// Run migrations
createTables()
  .then(() => {
    console.log('Database migration completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during migration:', err);
    process.exit(1);
  }); 