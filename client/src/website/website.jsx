import React from 'react';
import HeroImage from "../assets/heropageimage.png";
import Navbar from "./navbar";

export const Website = () => {
  return (
    <div>
      <Navbar/>
      <img
          className="w-20 cursor-pointer p-1"
          src={HeroImage}
          alt="Logo"
      />
    </div>
  )
}