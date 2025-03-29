import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { songService, artistService } from '../services/api';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('songs'); // 'songs' or 'artists'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all songs
        const songsResponse = await songService.getAllSongs();
        setSongs(songsResponse.data);
        
        // Fetch all artists
        const artistsResponse = await artistService.getAllArtists();
        setArtists(artistsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      const response = await songService.searchSongs(searchTerm);
      setSongs(response.data);
      setActiveTab('songs');
      setLoading(false);
    } catch (err) {
      setError('Search failed. Please try again.');
      setLoading(false);
      console.error('Error searching:', err);
    }
  };
  
  // Reset search
  const resetSearch = async () => {
    setSearchTerm('');
    try {
      setLoading(true);
      const response = await songService.getAllSongs();
      setSongs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to reset search. Please try again.');
      setLoading(false);
      console.error('Error resetting search:', err);
    }
  };
  
  // Format is detected based on the filename extension
  const getFormatFromFilename = (filename) => {
    if (filename.endsWith('.chordpro')) {
      return 'chordpro';
    }
    return 'plaintext';
  };
  
  // Filter songs by search term
  const filteredSongs = searchTerm
    ? songs.filter(song => 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : songs;
  
  // Filter artists by search term
  const filteredArtists = searchTerm
    ? artists.filter(artist => 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : artists;
    
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MyChords</h1>
        <p className="text-gray-600">A simple app to view and manage your chord and tab files.</p>
      </div>
      
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            placeholder="Search songs or artists..."
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchTerm && (
            <button
              className="px-3 bg-gray-200 hover:bg-gray-300"
              onClick={resetSearch}
            >
              ×
            </button>
          )}
          <button
            className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'songs' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('songs')}
          >
            Songs ({filteredSongs.length})
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'artists' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('artists')}
          >
            Artists ({filteredArtists.length})
          </button>
        </div>
      </div>
      
      {activeTab === 'songs' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {searchTerm ? `Search Results: ${filteredSongs.length} songs` : 'All Songs'}
            </h2>
            <Link
              to="/songs/new"
              className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
            >
              Add Song
            </Link>
          </div>
          
          {filteredSongs.length === 0 ? (
            <div className="bg-yellow-100 p-4 rounded">
              <p>No songs found. Try a different search term or add a new song.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSongs.map(song => {
                const format = getFormatFromFilename(song.filename);
                return (
                  <Link
                    key={song.id}
                    to={`/songs/${song.id}?format=${format}`}
                    className="block p-4 bg-white rounded shadow hover:shadow-md transition"
                  >
                    <div className="font-bold mb-1 truncate">{song.title}</div>
                    {song.artist && (
                      <div className="text-gray-600 text-sm mb-2 truncate">{song.artist}</div>
                    )}
                    <div className="flex items-center">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">
                        {format === 'chordpro' ? 'ChordPro' : 'Text'}
                      </span>
                      {song.key && (
                        <span className="ml-2 text-xs text-gray-600">
                          Key: {song.key}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'artists' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {searchTerm ? `Search Results: ${filteredArtists.length} artists` : 'All Artists'}
            </h2>
          </div>
          
          {filteredArtists.length === 0 ? (
            <div className="bg-yellow-100 p-4 rounded">
              <p>No artists found. Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArtists.map(artist => (
                <div
                  key={artist.id}
                  className="p-4 bg-white rounded shadow hover:shadow-md transition"
                >
                  <div className="font-bold mb-1">{artist.name}</div>
                  <div className="text-gray-600 text-sm">{artist.songCount} songs</div>
                  <Link
                    to={`/artists/${artist.id}`}
                    className="mt-2 text-primary hover:underline text-sm block"
                  >
                    View songs &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home; 