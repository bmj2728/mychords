import { useState, useEffect } from 'react';

/**
 * Custom hook for transposing chord content
 * @param {string} originalContent - Original content with chords
 * @returns {Object} - Transpose controls and state
 */
const useTranspose = (originalContent) => {
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [transposedContent, setTransposedContent] = useState(originalContent || '');
  
  // Update transposed content when originalContent or transposeSteps change
  useEffect(() => {
    if (originalContent) {
      setTransposedContent(transposeChordContent(originalContent, transposeSteps));
    }
  }, [originalContent, transposeSteps]);
  
  // Transpose a single chord
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
  
  // Transpose entire chord content
  const transposeChordContent = (content, steps) => {
    if (!content || steps === 0) return content;
    
    // Regex to match chord patterns
    const chordRegex = /\b[A-G][#b]?(?:maj|min|m|sus|aug|dim|add|M|7|9|11|13|6|5)*(?:\/[A-G][#b]?)?\b/g;
    
    // Replace each chord with its transposed version
    return content.replace(chordRegex, (match) => transposeChord(match, steps));
  };
  
  // Increment transpose steps
  const transposeUp = () => {
    setTransposeSteps(prev => prev + 1);
  };
  
  // Decrement transpose steps
  const transposeDown = () => {
    setTransposeSteps(prev => prev - 1);
  };
  
  // Reset transpose
  const resetTranspose = () => {
    setTransposeSteps(0);
  };
  
  return {
    transposeSteps,
    transposedContent,
    transposeUp,
    transposeDown,
    resetTranspose,
    setTransposeSteps
  };
};

export default useTranspose; 