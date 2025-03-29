import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyChords</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your personal library for guitar chords and tabs. 
          Easily organize, view, and play along with your favorite songs.
        </p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-primary">Browse Artists</h2>
          <p className="mb-4">
            Explore your music collection organized by artists. Find your favorite bands and musicians.
          </p>
          <Link to="/artists" className="btn btn-primary inline-block">
            View Artists
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-secondary">Recent Songs</h2>
          <p className="mb-4">
            Quick access to your recently added or viewed chord sheets and tabs.
          </p>
          <button className="btn btn-secondary inline-block">
            Recent Songs
          </button>
        </div>
      </section>
      
      <section className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="text-xl font-semibold mb-2">Autoscroll</h3>
            <p>Hands-free scrolling while you play your instrument.</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="text-xl font-semibold mb-2">Transpose</h3>
            <p>Change the key of chord sheets to match your vocal range.</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="text-xl font-semibold mb-2">Search</h3>
            <p>Quickly find songs by artist or title.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 