const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database initialization function
const initializeDatabase = require('./database/init');

// Import routes
const artistRoutes = require('./routes/artists');
const songRoutes = require('./routes/songs');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the database before setting up routes
(async () => {
  try {
    await initializeDatabase();
    
    // API Routes - only set up after database is initialized
    app.use('/api/artists', artistRoutes);
    app.use('/api/songs', songRoutes);
    
    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
      // Set static folder
      app.use(express.static(path.join(__dirname, '../client/build')));
    
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
      });
    }
    
    // Basic error handling
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send({ message: 'Server Error', error: err.message });
    });
    
    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    process.exit(1);
  }
})(); 