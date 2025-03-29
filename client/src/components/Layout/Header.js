import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white shadow-md">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            MyChords
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/artists" className="hover:text-primary transition-colors">
                  Artists
                </Link>
              </li>
            </ul>
          </nav>
          
          <div>
            <form className="flex">
              <input
                type="text"
                placeholder="Search songs or artists..."
                className="px-4 py-1 rounded-l text-dark"
              />
              <button
                type="submit"
                className="bg-primary px-4 py-1 rounded-r hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 