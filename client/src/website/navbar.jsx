import React, { useState } from "react";
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <header className="bg-white">
        <nav className="flex justify-between items-center w-[92%]  mx-auto">
          <div>
            <img
              className="w-20 cursor-pointer p-1"
              src={logo}
              alt="Logo"
            />
          </div>
          <div
            className={`nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 top-${
              menuOpen ? "9%" : "-100%"
            } md:w-auto  w-full flex items-center px-5`}
          >
            <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
              <li>
                <a className="hover:text-gray-500" href="#">
                  <Link to="/">Home</Link>
                </a>
              </li>
              <li>
              <Link to="/checkmyorder">
                <a className="hover:text-gray-500" href="#">
                  Check my order
                </a>
              </Link>
                
              </li>
              <li>
                <a className="hover:text-gray-500" href="#">
                  Notices
                </a>
              </li>
              <li>
                <a className="hover:text-gray-500" href="#">
                  Services
                </a>
              </li>
              <li>
                <a className="hover:text-gray-500" href="#">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/stafflogin">
            <button className="bg-[#1E90FF] text-white px-5 py-2 hover:bg-[#1464B2]">
              Staff Login
            </button>
            </Link>
            <ion-icon
              onClick={toggleMenu}
              name={menuOpen ? "close" : "menu"}
              className="text-3xl cursor-pointer md:hidden"
            ></ion-icon>
          </div>
        </nav>
      </header>
    </div>
  );
};


export default Navbar;