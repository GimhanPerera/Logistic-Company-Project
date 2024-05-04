import React from 'react';
import HeroImage from "../assets/heropageimage.png";
import Navbar from "./navbar";

export const Website = () => {
  return (
    <div>
      <Navbar />

      <img
        src={HeroImage}
        alt="Logo"
      />
      <img
        src={HeroImage}
        alt="Logo"
      />
      <img
        src={HeroImage}
        alt="Logo"
      />
    </div>
  )
}