import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { songService } from '../services/api';
import useAutoscroll from '../hooks/useAutoscroll';
import useTranspose from '../hooks/useTranspose';

const SongDetail = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reference to the scrollable content
  const contentRef = useRef(null);
  
  // Use custom hooks for autoscroll and transpose
  const { 
    isScrolling, 
    scrollSpeed, 
    toggleAutoscroll, 
    changeScrollSpeed 
  } = useAutoscroll(contentRef);
  
  const {
    transposeSteps,
    transposedContent,
    transposeUp,
    transposeDown,
    resetTranspose
  } = useTranspose(song?.content);
  
  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const response = await songService.getSongById(songId);
        setSong(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load song. Please try again later.');
        setLoading(false);
        console.error('Error fetching song:', err);
      }
    };

    fetchSong();
  }, [songId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading song...</div>
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

  if (!song) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Song not found</p>
        <Link to="/artists" className="mt-2 text-primary hover:underline">
          Back to artists
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link 
            to={`/artists/${song.artistId}`} 
            className="text-primary hover:underline mb-2 inline-block"
          >
            &larr; Back to {song.artist?.name || 'artist'}
          </Link>
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">
              {song.artist?.name || 'Unknown Artist'}
            </span>
            <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">
              {song.type === 'chord' ? 'Chord Sheet' : 'Tablature'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="btn btn-primary">Edit</button>
          <button className="btn bg-red-500 text-white hover:bg-red-600">Delete</button>
        </div>
      </div>
      
      {song.type === 'chord' && (
        <div className="bg-white p-3 rounded shadow mb-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Transpose</div>
            <div className="flex items-center">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                onClick={transposeDown}
              >
                -
              </button>
              <span className="mx-2 w-6 text-center">{transposeSteps > 0 ? `+${transposeSteps}` : transposeSteps}</span>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                onClick={transposeUp}
              >
                +
              </button>
              <button 
                className="ml-2 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={resetTranspose}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white p-3 rounded shadow mb-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Autoscroll</div>
          <div className="flex items-center">
            <button 
              className={`px-3 py-1 rounded ${isScrolling ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
              onClick={toggleAutoscroll}
            >
              {isScrolling ? 'Stop' : 'Start'}
            </button>
            <div className="ml-4 flex items-center">
              <span className="mr-2 text-sm">Speed:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={scrollSpeed}
                onChange={(e) => changeScrollSpeed(parseInt(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div 
        ref={contentRef}
        className="bg-white p-6 rounded-lg shadow max-h-[60vh] overflow-y-auto font-mono whitespace-pre-wrap"
      >
        {transposedContent}
      </div>
    </div>
  );
};

export default SongDetail; 