import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">MyChords</h3>
            <p className="text-sm text-gray-400">A self-hosted chord and tab viewer</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} MyChords. MIT License.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 