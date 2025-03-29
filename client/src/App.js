import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import ArtistList from './pages/ArtistList';
import ArtistDetail from './pages/ArtistDetail';
import SongDetail from './pages/SongDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-light">
      <Header />
      <main className="flex-grow container-custom py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/artists/:artistId" element={<ArtistDetail />} />
          <Route path="/songs/:songId" element={<SongDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 