const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert callback-based functions to promise-based
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);

// Define base paths
const SONGS_DIR = path.join(__dirname, '../../data/songs');
const CHORDPRO_DIR = path.join(SONGS_DIR, 'chordpro');
const PLAINTEXT_DIR = path.join(SONGS_DIR, 'plaintext');

console.log('Song file paths:');
console.log(`Songs directory: ${SONGS_DIR}`);
console.log(`ChordPro directory: ${CHORDPRO_DIR}`);
console.log(`Plaintext directory: ${PLAINTEXT_DIR}`);

// Create directories if they don't exist
const ensureDirectoriesExist = () => {
  if (!fs.existsSync(SONGS_DIR)) {
    fs.mkdirSync(SONGS_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHORDPRO_DIR)) {
    fs.mkdirSync(CHORDPRO_DIR, { recursive: true });
  }
  if (!fs.existsSync(PLAINTEXT_DIR)) {
    fs.mkdirSync(PLAINTEXT_DIR, { recursive: true });
  }
};

ensureDirectoriesExist();

/**
 * Get all song files
 * @param {String} format - 'chordpro' or 'plaintext' (optional)
 * @returns {Promise<Array>} - Array of song objects
 */
const getAllSongs = async (format = null) => {
  try {
    let songs = [];
    
    // Get ChordPro files if not filtered or specifically requested
    if (!format || format === 'chordpro') {
      const chordproFiles = await readdir(CHORDPRO_DIR);
      const chordproSongs = await Promise.all(chordproFiles.map(async (filename) => {
        if (filename.endsWith('.chordpro')) {
          const filePath = path.join(CHORDPRO_DIR, filename);
          const metadata = await extractChordProMetadata(filePath);
          return {
            id: filename.replace('.chordpro', ''),
            filename,
            format: 'chordpro',
            path: filePath,
            ...metadata
          };
        }
        return null;
      }));
      songs = songs.concat(chordproSongs.filter(song => song !== null));
    }
    
    // Get plaintext files if not filtered or specifically requested
    if (!format || format === 'plaintext') {
      const plaintextFiles = await readdir(PLAINTEXT_DIR);
      const plaintextSongs = await Promise.all(plaintextFiles.map(async (filename) => {
        if (filename.endsWith('.txt')) {
          const filePath = path.join(PLAINTEXT_DIR, filename);
          const metadata = await extractPlaintextMetadata(filePath);
          return {
            id: filename.replace('.txt', ''),
            filename,
            format: 'plaintext',
            path: filePath,
            ...metadata
          };
        }
        return null;
      }));
      songs = songs.concat(plaintextSongs.filter(song => song !== null));
    }
    
    return songs;
  } catch (error) {
    console.error('Error getting songs:', error);
    throw error;
  }
};

/**
 * Get a song by ID
 * @param {String} id - Song ID (filename without extension)
 * @param {String} format - 'chordpro' or 'plaintext'
 * @returns {Promise<Object>} - Song object with content
 */
const getSongById = async (id, format) => {
  try {
    const extension = format === 'chordpro' ? '.chordpro' : '.txt';
    const directory = format === 'chordpro' ? CHORDPRO_DIR : PLAINTEXT_DIR;
    const filePath = path.join(directory, `${id}${extension}`);
    
    console.log(`Looking for file: ${filePath}`);
    console.log(`File exists: ${fs.existsSync(filePath)}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      console.log(`Directory contents: ${fs.readdirSync(directory)}`);
      return null;
    }
    
    // Read file content
    const content = await readFile(filePath, 'utf8');
    console.log(`Successfully read file: ${filePath}`);
    
    // Extract metadata
    const metadataExtractor = format === 'chordpro' 
      ? extractChordProMetadata 
      : extractPlaintextMetadata;
    
    const metadata = await metadataExtractor(filePath);
    
    return {
      id,
      filename: `${id}${extension}`,
      format,
      path: filePath,
      content,
      ...metadata
    };
  } catch (error) {
    console.error(`Error getting song ${id}:`, error);
    throw error;
  }
};

/**
 * Extract metadata from ChordPro file
 * @param {String} filePath - Path to ChordPro file
 * @returns {Promise<Object>} - Metadata object
 */
const extractChordProMetadata = async (filePath) => {
  try {
    const content = await readFile(filePath, 'utf8');
    
    const metadata = {
      title: '',
      artist: '',
      album: '',
      year: '',
      key: ''
    };
    
    // Extract title
    const titleMatch = content.match(/{title:\s*(.+?)}/);
    if (titleMatch) metadata.title = titleMatch[1].trim();
    
    // Extract artist
    const artistMatch = content.match(/{artist:\s*(.+?)}/);
    if (artistMatch) metadata.artist = artistMatch[1].trim();
    
    // Extract album
    const albumMatch = content.match(/{album:\s*(.+?)}/);
    if (albumMatch) metadata.album = albumMatch[1].trim();
    
    // Extract year
    const yearMatch = content.match(/{year:\s*(.+?)}/);
    if (yearMatch) metadata.year = yearMatch[1].trim();
    
    // Extract key
    const keyMatch = content.match(/{key:\s*(.+?)}/);
    if (keyMatch) metadata.key = keyMatch[1].trim();
    
    // Use filename as title if not found in metadata
    if (!metadata.title) {
      const basename = path.basename(filePath, '.chordpro');
      metadata.title = basename.replace(/_/g, ' ');
    }
    
    return metadata;
  } catch (error) {
    console.error(`Error extracting metadata from ${filePath}:`, error);
    return {
      title: path.basename(filePath, '.chordpro').replace(/_/g, ' ')
    };
  }
};

/**
 * Extract metadata from plaintext file
 * @param {String} filePath - Path to plaintext file
 * @returns {Promise<Object>} - Metadata object
 */
const extractPlaintextMetadata = async (filePath) => {
  try {
    const content = await readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    const metadata = {
      title: '',
      artist: '',
      album: '',
      year: '',
      key: ''
    };
    
    // First line often contains title and artist
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      const titleArtistMatch = firstLine.match(/^(.+?)\s*-\s*(.+?)$/);
      
      if (titleArtistMatch) {
        metadata.title = titleArtistMatch[1].trim();
        metadata.artist = titleArtistMatch[2].trim();
      } else {
        metadata.title = firstLine;
      }
    }
    
    // Look for key in first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const keyMatch = lines[i].match(/^Key:\s*(.+?)$/i);
      if (keyMatch) {
        metadata.key = keyMatch[1].trim();
        break;
      }
    }
    
    // Use filename as title if not found in metadata
    if (!metadata.title) {
      const basename = path.basename(filePath, '.txt');
      metadata.title = basename.replace(/_/g, ' ');
    }
    
    return metadata;
  } catch (error) {
    console.error(`Error extracting metadata from ${filePath}:`, error);
    return {
      title: path.basename(filePath, '.txt').replace(/_/g, ' ')
    };
  }
};

/**
 * Save a song file
 * @param {String} id - Song ID (filename without extension)
 * @param {String} format - 'chordpro' or 'plaintext'
 * @param {String} content - File content
 * @returns {Promise<Object>} - Saved song object
 */
const saveSong = async (id, format, content) => {
  try {
    const extension = format === 'chordpro' ? '.chordpro' : '.txt';
    const directory = format === 'chordpro' ? CHORDPRO_DIR : PLAINTEXT_DIR;
    const filePath = path.join(directory, `${id}${extension}`);
    
    // Write content to file
    await writeFile(filePath, content, 'utf8');
    
    // Extract metadata from saved file
    const metadataExtractor = format === 'chordpro' 
      ? extractChordProMetadata 
      : extractPlaintextMetadata;
    
    const metadata = await metadataExtractor(filePath);
    
    return {
      id,
      filename: `${id}${extension}`,
      format,
      path: filePath,
      ...metadata
    };
  } catch (error) {
    console.error(`Error saving song ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a song file
 * @param {String} id - Song ID (filename without extension)
 * @param {String} format - 'chordpro' or 'plaintext'
 * @returns {Promise<Boolean>} - True if deleted successfully
 */
const deleteSong = async (id, format) => {
  try {
    const extension = format === 'chordpro' ? '.chordpro' : '.txt';
    const directory = format === 'chordpro' ? CHORDPRO_DIR : PLAINTEXT_DIR;
    const filePath = path.join(directory, `${id}${extension}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    // Delete file
    await unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting song ${id}:`, error);
    throw error;
  }
};

/**
 * Search for songs by title or artist
 * @param {String} searchTerm - Search term
 * @returns {Promise<Array>} - Array of matching song objects
 */
const searchSongs = async (searchTerm) => {
  try {
    // Get all songs
    const allSongs = await getAllSongs();
    
    // Filter songs by search term (case-insensitive)
    const searchTermLower = searchTerm.toLowerCase();
    const matchingSongs = allSongs.filter(song => {
      const titleMatch = song.title && song.title.toLowerCase().includes(searchTermLower);
      const artistMatch = song.artist && song.artist.toLowerCase().includes(searchTermLower);
      return titleMatch || artistMatch;
    });
    
    return matchingSongs;
  } catch (error) {
    console.error(`Error searching for songs with term "${searchTerm}":`, error);
    throw error;
  }
};

/**
 * Get all artists based on song metadata
 * @returns {Promise<Array>} - Array of artist objects
 */
const getArtists = async () => {
  try {
    // Get all songs
    const allSongs = await getAllSongs();
    
    // Extract unique artists
    const artistsMap = {};
    
    allSongs.forEach(song => {
      if (song.artist && song.artist.trim()) {
        if (!artistsMap[song.artist]) {
          artistsMap[song.artist] = {
            id: song.artist.toLowerCase().replace(/\s+/g, '_'),
            name: song.artist,
            songCount: 1
          };
        } else {
          artistsMap[song.artist].songCount++;
        }
      }
    });
    
    return Object.values(artistsMap);
  } catch (error) {
    console.error('Error getting artists:', error);
    throw error;
  }
};

/**
 * Get songs by artist
 * @param {String} artistId - Artist ID (lowercase with underscores)
 * @returns {Promise<Array>} - Array of song objects by the artist
 */
const getSongsByArtist = async (artistId) => {
  try {
    // Get all songs
    const allSongs = await getAllSongs();
    
    // Find the artist name from the ID
    const artistName = artistId.replace(/_/g, ' ');
    
    // Filter songs by artist (case-insensitive)
    const artistSongs = allSongs.filter(song => {
      return song.artist && song.artist.toLowerCase() === artistName.toLowerCase();
    });
    
    return artistSongs;
  } catch (error) {
    console.error(`Error getting songs for artist ${artistId}:`, error);
    throw error;
  }
};

/**
 * Create a new song ID from title
 * @param {String} title - Song title
 * @param {String} format - 'chordpro' or 'plaintext'
 * @returns {String} - Unique song ID
 */
const createSongId = async (title, format) => {
  // Create base ID from title
  const baseId = title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  
  // Check if file already exists
  const extension = format === 'chordpro' ? '.chordpro' : '.txt';
  const directory = format === 'chordpro' ? CHORDPRO_DIR : PLAINTEXT_DIR;
  let filePath = path.join(directory, `${baseId}${extension}`);
  
  // If file exists, add a number suffix
  if (fs.existsSync(filePath)) {
    let counter = 1;
    let newId = `${baseId}_${counter}`;
    filePath = path.join(directory, `${newId}${extension}`);
    
    while (fs.existsSync(filePath)) {
      counter++;
      newId = `${baseId}_${counter}`;
      filePath = path.join(directory, `${newId}${extension}`);
    }
    
    return newId;
  }
  
  return baseId;
};

module.exports = {
  getAllSongs,
  getSongById,
  saveSong,
  deleteSong,
  searchSongs,
  getArtists,
  getSongsByArtist,
  createSongId
}; 