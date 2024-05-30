import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import HeroImage from "../assets/heropageimage.png";
import Navbar from "./navbar";

export const Website = () => {
  const [notices, setNotices] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3001/api/noitces/public")
      .then((response) => {
        setNotices(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching courier details:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);
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
      {loading ? (
        ''
      ) : (
      <Box component="div" sx={{
        display: 'flex',
        flexDirection: 'column',}}>
        {notices.map((notice, index) => (
        <Box component="div" key={index}
        sx={{
          border:'1px gray solid',
          padding:'1rem',
          margin:'1rem 3rem',
          // Width:'500px'
        }}
        >
          <Box component="p" sx={{fontWeight:'800'}}>{notice.title}</Box>
          <Box component="p">{notice.description}</Box>
        </Box>
      ))}
      </Box>
      )}


      <img
        src={HeroImage}
        alt="Logo"
      />
    </div>
  )
}