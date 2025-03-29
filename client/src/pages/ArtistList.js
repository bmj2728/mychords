import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/artists');
        setArtists(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load artists. Please try again later.');
        setLoading(false);
        console.error('Error fetching artists:', err);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading artists...</div>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Artists</h1>
        <button className="btn btn-primary">Add Artist</button>
      </div>

      {artists.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600 mb-4">No artists found</p>
          <p className="text-gray-500">Start by adding your first artist!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div 
              key={artist.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-40 bg-gray-300 flex items-center justify-center">
                {artist.imageUrl ? (
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-gray-500">No Image</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
                {artist.info && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{artist.info}</p>
                )}
                <Link 
                  to={`/artists/${artist.id}`}
                  className="text-primary hover:underline"
                >
                  View Songs
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistList; 