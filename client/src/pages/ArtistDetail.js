import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ArtistDetail = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistAndSongs = async () => {
      try {
        setLoading(true);
        
        // Fetch artist details
        const artistResponse = await axios.get(`/api/artists/${artistId}`);
        setArtist(artistResponse.data);
        
        // Fetch songs by this artist
        const songsResponse = await axios.get(`/api/artists/${artistId}/songs`);
        setSongs(songsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load artist details. Please try again later.');
        setLoading(false);
        console.error('Error fetching artist details:', err);
      }
    };

    fetchArtistAndSongs();
  }, [artistId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading artist details...</div>
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

  if (!artist) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Artist not found</p>
        <Link to="/artists" className="mt-2 text-primary hover:underline">
          Back to artists
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/artists" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to all artists
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {artist.imageUrl && (
            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden">
              <img 
                src={artist.imageUrl} 
                alt={artist.name}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
            {artist.info && (
              <p className="text-gray-600 mb-2">{artist.info}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Songs</h2>
          <button className="btn btn-primary">Add Song</button>
        </div>
        
        {songs.length === 0 ? (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">No songs found for this artist</p>
            <p className="text-gray-500">Add the first song!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {songs.map((song) => (
                <li key={song.id} className="p-4 hover:bg-gray-50">
                  <Link 
                    to={`/songs/${song.id}`}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium">{song.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded mt-1">
                        {song.type === 'chord' ? 'Chord Sheet' : 'Tablature'}
                      </span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-gray-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail; 