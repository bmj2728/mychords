/**
 * Parse ChordPro format string into HTML
 * @param {string} chordproContent - ChordPro formatted string
 * @returns {object} - HTML content and metadata
 */
const parseChordPro = (chordproContent) => {
  if (!chordproContent) return { html: '', metadata: {} };
  
  // Extract metadata
  const metadata = extractMetadata(chordproContent);
  
  // Process content
  let content = chordproContent;
  
  // Replace section directives
  content = replaceSections(content);
  
  // Replace chord notations [chord]
  content = replaceChords(content);
  
  // Replace annotations [*annotation]
  content = replaceAnnotations(content);
  
  // Handle markup tags (like <b>, <i>, etc.)
  content = handleMarkup(content);
  
  // Convert newlines to <br>
  content = content.replace(/\n/g, '<br>');
  
  return {
    html: content,
    metadata
  };
};

/**
 * Extract metadata from ChordPro content
 * @param {string} content - ChordPro content
 * @returns {object} - Extracted metadata
 */
const extractMetadata = (content) => {
  const metadata = {
    title: '',
    artist: '',
    album: '',
    year: '',
    key: '',
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
  
  return metadata;
};

/**
 * Replace section directives with HTML
 * @param {string} content - ChordPro content
 * @returns {string} - Content with replaced sections
 */
const replaceSections = (content) => {
  let processedContent = content;
  
  // Handle start_of_verse with labels
  processedContent = processedContent.replace(
    /{start_of_verse:\s*(.+?)}/g, 
    '<div class="verse mb-4"><div class="verse-label text-gray-500 text-sm mb-1">$1</div>'
  );
  
  // Handle start_of_verse without labels
  processedContent = processedContent.replace(
    /{start_of_verse}/g, 
    '<div class="verse mb-4">'
  );
  
  // Handle end_of_verse
  processedContent = processedContent.replace(
    /{end_of_verse}/g, 
    '</div>'
  );
  
  // Handle start_of_chorus with labels
  processedContent = processedContent.replace(
    /{start_of_chorus:\s*(.+?)}/g, 
    '<div class="chorus mb-4 pl-4 border-l-4 border-blue-500"><div class="chorus-label text-blue-500 text-sm mb-1">$1</div>'
  );
  
  // Handle start_of_chorus without labels
  processedContent = processedContent.replace(
    /{start_of_chorus}/g, 
    '<div class="chorus mb-4 pl-4 border-l-4 border-blue-500"><div class="chorus-label text-blue-500 text-sm mb-1">Chorus</div>'
  );
  
  // Handle end_of_chorus
  processedContent = processedContent.replace(
    /{end_of_chorus}/g, 
    '</div>'
  );
  
  // Handle start_of_bridge with labels
  processedContent = processedContent.replace(
    /{start_of_bridge:\s*(.+?)}/g, 
    '<div class="bridge mb-4 pl-4 border-l-4 border-yellow-500"><div class="bridge-label text-yellow-600 text-sm mb-1">$1</div>'
  );
  
  // Handle start_of_bridge without labels
  processedContent = processedContent.replace(
    /{start_of_bridge}/g, 
    '<div class="bridge mb-4 pl-4 border-l-4 border-yellow-500"><div class="bridge-label text-yellow-600 text-sm mb-1">Bridge</div>'
  );
  
  // Handle end_of_bridge
  processedContent = processedContent.replace(
    /{end_of_bridge}/g, 
    '</div>'
  );
  
  // Handle all other metadata directives
  processedContent = processedContent.replace(
    /{[^{}]*}/g, 
    ''
  );
  
  return processedContent;
};

/**
 * Replace chord notations with HTML chord spans
 * @param {string} content - ChordPro content
 * @returns {string} - Content with replaced chords
 */
const replaceChords = (content) => {
  return content.replace(
    /\[(.*?)\]/g,
    (match, chord) => {
      // Skip if this is an annotation
      if (chord.startsWith('*')) return match;
      
      return `<span class="chord text-primary font-bold relative mr-1">${chord}</span>`;
    }
  );
};

/**
 * Replace annotation notations with HTML annotation spans
 * @param {string} content - ChordPro content with annotations
 * @returns {string} - Content with replaced annotations
 */
const replaceAnnotations = (content) => {
  return content.replace(
    /\[\*(.*?)\]/g,
    (match, annotation) => {
      return `<span class="annotation text-red-500 italic">${annotation}</span>`;
    }
  );
};

/**
 * Handle markup tags in ChordPro content
 * @param {string} content - ChordPro content with markup
 * @returns {string} - Content with processed markup
 */
const handleMarkup = (content) => {
  // This implementation allows a subset of HTML formatting
  // For security, we'd need a more robust implementation in production
  return content;
};

/**
 * Transpose a chord to a new key
 * @param {string} chord - The chord to transpose
 * @param {number} steps - Number of semitones to transpose
 * @returns {string} - Transposed chord
 */
const transposeChord = (chord, steps) => {
  // Basic chord parsing - for a real app we'd need more sophisticated parsing
  const chordRegex = /^([A-G][#b]?)(.*)$/;
  const match = chord.match(chordRegex);
  
  if (!match) return chord; // Not a valid chord
  
  const root = match[1];
  const quality = match[2];
  
  // Define the chromatic scale
  const sharpScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  
  // Choose scale based on original chord
  const scale = root.includes('b') ? flatScale : sharpScale;
  
  // Find the current position in the scale
  let currentPos = -1;
  for (let i = 0; i < scale.length; i++) {
    if (scale[i] === root) {
      currentPos = i;
      break;
    }
  }
  
  if (currentPos === -1) return chord; // Chord root not found
  
  // Calculate new position
  const newPos = (currentPos + steps + 12) % 12;
  
  // Return the transposed chord
  return scale[newPos] + quality;
};

/**
 * Transpose all chords in ChordPro content
 * @param {string} content - ChordPro content
 * @param {number} steps - Number of semitones to transpose
 * @returns {string} - Transposed ChordPro content
 */
const transposeChordPro = (content, steps) => {
  if (steps === 0) return content;
  
  return content.replace(
    /\[([^\*][^\]]*)\]/g,
    (match, chord) => {
      const transposed = transposeChord(chord, steps);
      return `[${transposed}]`;
    }
  );
};

export { parseChordPro, transposeChordPro, extractMetadata }; 