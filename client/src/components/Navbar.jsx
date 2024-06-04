import { Box } from '@mui/material';
import axios from "axios";
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Autheader from "../services/Autheader";
import './Navbar.css';

const Navbar = ({ sidebarToggle, setSidebarToggle, value }) => {

  const navigate = useNavigate();

  const toProfile = () => {
    axios.get("http://localhost:3001/api/employee/getForProfile", {
      headers: {
        ...Autheader()
      }
    })
      .then((response) => {
        navigate('./profile', { state: { empData: response.data } });
      })
      .catch((error) => {
        console.error("Error fetching courier details:", error);
      });
  };

  return (
    <Box component="nav"
      sx={{
        backgroundColor: '#00084E',
        padding: '0.75rem 1rem',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: '1',
        ...(sidebarToggle ? { width: '100%' } : { width: 'calc(100% - 16rem)' })
      }}
    >
      <Box component="div"
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FaBars
          style={{ color: 'white', marginRight: '1rem', cursor: 'pointer' }}
          onClick={() => setSidebarToggle(!sidebarToggle)} />
        <Box component="span"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }} >{value}</Box>
      </Box>
      <Box component="div"
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className='user-info' onClick={toProfile} style={{ cursor: 'pointer' }}>
          <p className='user-greeting'>Welcome, Gimhan</p>
          <CgProfile className='user-icon' />
        </div>
      </Box>
    </Box>
  )
}

export default Navbar
