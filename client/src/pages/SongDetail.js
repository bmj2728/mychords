import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SongDetail = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Autoscroll state
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // pixels per 100ms
  const contentRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  
  // Transpose state (only for chord type)
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [transposedContent, setTransposedContent] = useState('');
  
  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/songs/${songId}`);
        setSong(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load song. Please try again later.');
        setLoading(false);
        console.error('Error fetching song:', err);
      }
    };

    fetchSong();
    
    // Cleanup autoscroll interval on unmount
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [songId]);
  
  // Update transposed content when song or transposeSteps change
  useEffect(() => {
    if (song && song.type === 'chord') {
      setTransposedContent(transposeChordContent(song.content, transposeSteps));
    } else if (song) {
      setTransposedContent(song.content);
    }
  }, [song, transposeSteps]);
  
  // Autoscroll logic
  const toggleAutoscroll = () => {
    if (isScrolling) {
      // Stop scrolling
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
      setIsScrolling(false);
    } else {
      // Start scrolling
      scrollIntervalRef.current = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop += scrollSpeed;
        }
      }, 100);
      setIsScrolling(true);
    }
  };
  
  // Change scroll speed
  const handleSpeedChange = (newSpeed) => {
    setScrollSpeed(newSpeed);
    
    // Reset interval with new speed if already scrolling
    if (isScrolling) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop += newSpeed;
        }
      }, 100);
    }
  };
  
  // Transpose logic
  const transposeChord = (chord, steps) => {
    const chordNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const altChordNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    // Extract the root note and the rest of the chord
    const match = chord.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return chord; // Not a valid chord
    
    const [, rootNote, chordType] = match;
    
    // Find the index of the root note
    let noteIndex = chordNotes.indexOf(rootNote);
    if (noteIndex === -1) {
      // Try alternate notation
      noteIndex = altChordNotes.indexOf(rootNote);
      if (noteIndex === -1) return chord; // Not found in either notation
    }
    
    // Calculate new index after transposition
    let newIndex = (noteIndex + steps) % 12;
    if (newIndex < 0) newIndex += 12;
    
    // Choose notation based on original chord
    let newRootNote;
    if (rootNote.includes('#') || (chordNotes.includes(rootNote) && !altChordNotes.includes(rootNote))) {
      newRootNote = chordNotes[newIndex];
    } else {
      newRootNote = altChordNotes[newIndex];
    }
    
    return newRootNote + chordType;
  };
  
  const transposeChordContent = (content, steps) => {
    if (steps === 0) return content;
    
    // Regex to match chord patterns
    const chordRegex = /\b[A-G][#b]?(?:maj|min|m|sus|aug|dim|add|M|7|9|11|13|6|5)*(?:\/[A-G][#b]?)?\b/g;
    
    // Replace each chord with its transposed version
    return content.replace(chordRegex, (match) => transposeChord(match, steps));
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
                onClick={() => setTransposeSteps(transposeSteps - 1)}
              >
                -
              </button>
              <span className="mx-2 w-6 text-center">{transposeSteps > 0 ? `+${transposeSteps}` : transposeSteps}</span>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setTransposeSteps(transposeSteps + 1)}
              >
                +
              </button>
              <button 
                className="ml-2 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={() => setTransposeSteps(0)}
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
                onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
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