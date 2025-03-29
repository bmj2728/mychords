# MyChords

MyChords is a self-hosted alternative to Ultimate Guitar, providing essential functionality for musicians to organize and display chord/tab files. This application focuses on simplicity and the most useful features for musicians.

## Features

- **Chord/Tab File Support**: Upload and view chord charts and tablature
- **Artist Organization**: Songs grouped by artist for easy navigation
- **Search Functionality**: Find songs by artist or song title
- **Autoscroll**: Hands-free scrolling while playing
- **Transpose**: Change the key of chord sheets on the fly
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite for lightweight, file-based storage
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/mychords.git
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

## Development

The project is structured as follows:

- `/client` - React frontend
- `/server` - Node.js backend
- `/docs` - Developer documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Ultimate Guitar
- Built with love for musicians everywhere 