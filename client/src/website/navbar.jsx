import { AppBar, Box, Tab, Tabs, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";
import DrawerCom from './drawerCom';

const Navbar = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme()
  const isMatch = useMediaQuery(theme.breakpoints.down('md'));
  //console.log("REST: " + isMatch);
  //console.log("V: " + value);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <AppBar sx={{ backgroundColor: 'white', position: 'fixed' }}>
        <Toolbar sx={{ backgroundColor: 'white' }}>

          {/* Logo */}
          <Box>
            <img
              id=""
              src={logo}
              alt="Logo"
              style={{
                width: '5rem',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            />
          </Box>
          {
            isMatch ? (
              <>
                <DrawerCom />
              </>
            ) : (
              <>

                <Tabs sx={{ margin: 'auto' }} >  {/* value={value} onChange={(e, value) => setValue(value)}*/}
                  <Link label="Home" to="/" onClick={() => setValue(0)}>
                    <Tab label="Home"></Tab>
                  </Link>
                  <Link to="/checkmyorder" onClick={() => setValue(1)}>
                    <Tab label="Check my order"></Tab>
                  </Link>
                  <Link to="/" onClick={() => setValue(2)}>
                    <Tab label="Notices"></Tab>
                  </Link>
                  <Link to="/" onClick={() => setValue(3)}>
                    <Tab label="Services"></Tab>
                  </Link>
                  <Link to="/" onClick={() => setValue(4)}>
                    <Tab label="Contact us"></Tab>
                  </Link>
                </Tabs>

                {/* staff login btn */}
                <Box>
                  <Link to="/stafflogin">
                    <Button variant="contained" sx={{ backgroundColor: '#1E90FF' }}>Staff Login</Button>
                  </Link>

                </Box>
              </>
            )
          }

        </Toolbar>

      </AppBar>
      <div style={{ paddingTop: '5rem' }} />{/* For resovle the fixed effect of Nav bar */}
    </>
  );
};


export default Navbar;