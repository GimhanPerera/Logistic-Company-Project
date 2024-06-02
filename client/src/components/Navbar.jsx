import { Box } from '@mui/material';
import React from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';
const Navbar = ({ sidebarToggle, setSidebarToggle, value }) => {
  return (
    <Box component="nav"
      sx={{
        backgroundColor: '#00084E',
        padding: '0.75rem 1rem',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex:'1',
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
        <div className='user-info'>
          <p className='user-greeting'>Welcome, Gimhan</p>
          <button className='user-button'>
            <FaUserCircle className='user-icon' />
            <div className='user-dropdown'>
              <ul className='dropdown-list'>
                <li><a href=''>Profile</a></li>
                <li><a href=''>Setting</a></li>
                <li><a href=''>Log out</a></li>
              </ul>
            </div>
          </button>
        </div>
      </Box>
    </Box>
  )
}

export default Navbar
