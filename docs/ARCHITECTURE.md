# MyChords Architecture

This document outlines the architecture of the MyChords application, serving as a reference for developers.

## System Overview

MyChords is a full-stack web application that allows users to store, view, and interact with chord and tablature files. The application consists of a React frontend and a Node.js backend, with SQLite for data persistence.

## Component Architecture

### Frontend

The frontend is built with React and structured as follows:

```
client/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout/      # Layout components (Header, Footer, etc.)
│   │   ├── Artist/      # Artist-related components
│   │   ├── Song/        # Song-related components
│   │   └── Viewer/      # Chord/Tab viewer components
│   ├── context/         # React Context for state management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   ├── styles/          # Global styles and Tailwind configuration
│   ├── utils/           # Utility functions
│   ├── App.js           # Main App component
│   └── index.js         # Entry point
└── ...
```

### Backend

The backend is a Node.js application with Express:

```
server/
├── controllers/         # Request handlers
├── models/              # Data models
├── routes/              # API route definitions
├── services/            # Business logic
├── utils/               # Utility functions
├── database/            # Database setup and migrations
├── app.js               # Express app setup
└── server.js            # Entry point
```

## Data Model

The application uses the following core data entities:

1. **Artist**: Represents a music artist/band
   - id: Unique identifier
   - name: Artist name
   - info: Additional information (optional)
   - imageUrl: Path to artist image (optional)

2. **Song**: Represents a song with chords or tabs
   - id: Unique identifier
   - title: Song title
   - artistId: Reference to artist
   - type: "chord" or "tab"
   - content: The actual chord/tab content
   - createdAt: Creation timestamp
   - updatedAt: Last update timestamp

## API Endpoints

### Artists

- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist by ID
- `POST /api/artists` - Create new artist
- `PUT /api/artists/:id` - Update artist
- `DELETE /api/artists/:id` - Delete artist

### Songs

- `GET /api/songs` - Get all songs (with query parameters for filtering)
- `GET /api/songs/:id` - Get song by ID
- `POST /api/songs` - Create new song
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song
- `GET /api/artists/:artistId/songs` - Get all songs by artist

## Key Features Implementation

### Autoscroll

The autoscroll feature allows users to set a scrolling speed for hands-free viewing while playing. 
It is implemented using:
- A custom React hook that manages the scroll state and speed
- DOM manipulation to control the scrolling behavior
- User controls to start, stop, and adjust scrolling speed

### Transpose

The transpose feature allows changing the key of chord sheets:
- A chord parsing utility identifies chord patterns in the text
- A chord transposition algorithm shifts chords up or down by a specified interval
- The UI provides controls to select the transposition interval

## Development Workflow

1. Clone the repository and install dependencies
2. Create a new branch for your feature/bugfix
3. Implement your changes
4. Write tests if applicable
5. Submit a pull request for review

## Database Schema Migration

Database changes should be managed through migration scripts in the `server/database/migrations` directory.

## Deployment

The application is designed for self-hosting and can be deployed on any system with Node.js. Detailed deployment instructions will be provided in a separate document. 