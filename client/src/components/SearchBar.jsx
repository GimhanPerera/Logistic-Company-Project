import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex items-center justify-center mt-4">
      <input
        type="text"
        placeholder="Search"
        className="border border-gray-300 px-4 py-2 mr-2 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button className="bg-[#68DD62] hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
