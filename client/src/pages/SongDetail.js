import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { songService } from '../services/api';
import useAutoscroll from '../hooks/useAutoscroll';
import { parseChordPro, transposeChordPro } from '../utils/chordproParser';

const SongDetail = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [transposedContent, setTransposedContent] = useState('');
  const [parsedContent, setParsedContent] = useState('');
  
  // Reference to the scrollable content
  const contentRef = useRef(null);
  
  // Use custom hook for autoscroll
  const { 
    isScrolling, 
    scrollSpeed, 
    toggleAutoscroll, 
    changeScrollSpeed 
  } = useAutoscroll(contentRef);
  
  // Function to get format from query params
  const getFormat = () => {
    // Parse the query parameters
    const searchParams = new URLSearchParams(location.search);
    const format = searchParams.get('format');
    
    // Default to 'chordpro' if not specified
    return format || 'chordpro';
  };
  
  const format = getFormat();
  
  // Transpose functions
  const transposeUp = () => {
    setTransposeSteps(prev => {
      const newSteps = prev + 1;
      if (song && song.content) {
        const transposed = transposeChordPro(song.content, newSteps);
        setTransposedContent(transposed);
        updateParsedContent(transposed);
      }
      return newSteps;
    });
  };
  
  const transposeDown = () => {
    setTransposeSteps(prev => {
      const newSteps = prev - 1;
      if (song && song.content) {
        const transposed = transposeChordPro(song.content, newSteps);
        setTransposedContent(transposed);
        updateParsedContent(transposed);
      }
      return newSteps;
    });
  };
  
  const resetTranspose = () => {
    setTransposeSteps(0);
    if (song && song.content) {
      setTransposedContent(song.content);
      updateParsedContent(song.content);
    }
  };
  
  // Update parsed content based on format
  const updateParsedContent = (content) => {
    if (format === 'chordpro') {
      const parsed = parseChordPro(content);
      setParsedContent(parsed.html);
    } else {
      // For plaintext, just replace newlines with <br> (reverting to original implementation)
      setParsedContent(content.replace(/\n/g, '<br>'));
    }
  };
  
  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        console.log(`Fetching song with ID: ${songId}, format: ${format}`);
        const response = await songService.getSongById(songId, format);
        setSong(response.data);
        setTransposedContent(response.data.content);
        updateParsedContent(response.data.content);
        setLoading(false);
      } catch (err) {
        setError('Failed to load song. Please try again later.');
        setLoading(false);
        console.error('Error fetching song:', err);
      }
    };

    fetchSong();
  }, [songId, format]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await songService.deleteSong(songId, format);
        navigate('/');
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('Failed to delete song. Please try again.');
      }
    }
  };
  
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
        <Link to="/" className="mt-2 text-primary hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link 
            to="/"
            className="text-primary hover:underline mb-2 inline-block"
          >
            &larr; Back to song list
          </Link>
          <h1 className="text-3xl font-bold">{song.title}</h1>
          {song.artist && (
            <div className="flex items-center mt-2">
              <span className="text-gray-600 mr-2">
                {song.artist}
              </span>
              <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">
                {format === 'chordpro' ? 'ChordPro' : 'Plaintext'}
              </span>
            </div>
          )}
          {song.album && <div className="text-gray-600 mt-1">Album: {song.album}</div>}
          {song.key && <div className="text-gray-600">Key: {song.key}</div>}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/songs/${songId}/edit?format=${format}`)}
            className="btn btn-primary"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="btn bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      
      {format === 'chordpro' && (
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
        className="bg-white p-6 rounded-lg shadow max-h-[60vh] overflow-y-auto font-mono"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
    </div>
  );
};

export default SongDetail; 