# MyChords

MyChords is a self-hosted alternative to Ultimate Guitar, providing essential functionality for musicians to organize and display chord/tab files. This application focuses on simplicity and the most useful features for musicians.

## Features

- **Chord/Tab File Support**: View ChordPro and plaintext chord/tab files
- **Optimized Chord Display**: Chords positioned nicely above lyrics for easy reading
- **Artist Organization**: Songs grouped by artist for easy navigation
- **Search Functionality**: Find songs by artist or song title
- **Autoscroll**: Hands-free scrolling while playing
- **Transpose**: Change the key of ChordPro chord sheets on the fly
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express
- **Storage**: File-based storage for chord/tab files
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/bmj2728/mychords.git
cd mychords
```

2. Install dependencies
```
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

3. Start the development server
```
# Start backend and frontend concurrently
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

For production deployment instructions, see the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

## File Structure

The application stores song files in the following directories:
- `/data/songs/chordpro` - For ChordPro formatted files (`.chordpro` extension)
- `/data/songs/plaintext` - For plaintext chord files (`.txt` extension)

## File Formats

### ChordPro Files
ChordPro files use the `.chordpro` extension and follow the ChordPro format, with chord notations in square brackets:

```
{title: Song Title}
{artist: Artist Name}
{key: C}

[C]Here are the [G]lyrics with [Am]chords in brackets
```

### Plaintext Files
Plaintext files use the `.txt` extension with a simple format:

```
Song Title - Artist Name
Key: C

    C        G       Am
Here are the lyrics with chords above
```

## Project Structure

The project is structured as follows:

- `/client` - React frontend
- `/server` - Node.js backend
- `/data` - Song file storage
- `/docs` - Developer documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Ultimate Guitar
- Built with love for musicians everywhere 