import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { artistService } from '../services/api';

const ArtistDetail = () => {
  const { artistId } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchArtistSongs = async () => {
      try {
        setLoading(true);
        const response = await artistService.getSongsByArtist(artistId);
        setSongs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load artist songs. Please try again later.');
        setLoading(false);
        console.error('Error fetching artist songs:', err);
      }
    };
    
    fetchArtistSongs();
  }, [artistId]);
  
  // Format is detected based on the filename extension
  const getFormatFromFilename = (filename) => {
    if (filename.endsWith('.chordpro')) {
      return 'chordpro';
    }
    return 'plaintext';
  };
  
  // Get artist name from ID (removing underscores)
  const artistName = artistId.replace(/_/g, ' ');
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading songs...</div>
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
  
  if (songs.length === 0) {
    return (
      <div>
        <Link to="/" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to home
        </Link>
        <div className="bg-yellow-100 p-4 rounded">
          <p>No songs found for this artist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Link to="/" className="text-primary hover:underline mb-4 inline-block">
        &larr; Back to home
      </Link>
      
      <h1 className="text-3xl font-bold mb-4">{artistName}</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Songs ({songs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map(song => {
            const format = getFormatFromFilename(song.filename);
            return (
              <Link
                key={song.id}
                to={`/songs/${song.id}?format=${format}`}
                className="block p-4 bg-white rounded shadow hover:shadow-md transition"
              >
                <div className="font-bold mb-1 truncate">{song.title}</div>
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
      </div>
    </div>
  );
};

export default ArtistDetail; 