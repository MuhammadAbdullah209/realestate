import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavBar = () => {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const HandleSubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set('searchTerm', searchTerm);
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="bg-gray-200 py-4 shadow-sm">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/">
          <span className="text-xl font-bold text-gray-800">
            Dream<span className="font-normal">Estate</span>
          </span>
        </Link>

        <form
          className="relative w-1/3"
          onSubmit={HandleSubmit}
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => navigate('/search')}
          />
          <button
            type="submit"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
          >
            <FaSearch />
          </button>
        </form>

        <nav className="space-x-6 text-sm text-gray-800">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/About" className="hover:text-blue-600">About</Link>
          <Link to="/Profile" className="hover:text-blue-600 font-semibold">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 inline-block align-middle"
              />
            ) : (
              'SignUp'
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
