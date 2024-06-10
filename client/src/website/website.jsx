import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import CompanyImg from "../assets/company1.png";
import HeroImage from "../assets/heropageimage.png";
import Section2Img from "../assets/section2Img.jpg";
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
      {/* Hero section */}
      <Box component='div'
        sx={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100vh',
        }}>
        <Box component='div' sx={{pt:'150px', pl:'80px'}}>
          <Box component='h1' sx={{ color: 'white', fontSize: '3rem' }}>Grow your business.</Box>
          <Box component='h1' sx={{ fontSize: '3rem' }}>We will take care</Box>
          <Box component='h1' sx={{ color: 'white', fontSize: '3rem' }}>all your logistics</Box>
          <Box component='p' sx={{ color: 'white', fontSize: '1rem', mt:'0.8rem' }}>We are handling imports from China to Sri Lanka and<br /> Dubai To Sri Lanka & China to Worldwide</Box>

          <Button variant="contained" sx={{m:'1rem', ml:'0'}}>Check my order</Button>
          <Button variant="outlined">Contact Us</Button>
        </Box>
      </Box>

      {/* Section 1 */}
      <Box component='div' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <Box component='div' sx={{ pt: '5rem', pl: '1rem' }}>
          <Box component='h1' sx={{ fontSize: '3.2rem' }}>Connect with Creative<br />
            Freight Way Logistics Pvt Ltd</Box>
          <Box component='p' sx={{ fontSize: '1.1rem', pt: '1rem' }}>
            dfldfmsl sdf sdl fasdf salk sd nasdn sdn sn gksd asdf dfa fsad askd  ksdgkdh gksdgiug <br />
            iasdg oasdg uas gisd dga ghsodghasfh wghsi ghsidagia gfi difa sdkas dghisd gidg iudgfiwahhf isdfsd<br />
            fskdfksdfh dsk dfldfmsl sdf sdl fasdf salk sd nasdn sdn sn gksd asdf dfa fsad askd  ksdgkdh gksdgiug<br />
            iasdg oasdg uas gisd dga ghsodghasfh wghsi ghsidagia gfi difa sdkas dghisd gidg iudgfiwahhf<br />
            isdfsd fskdfksdfh dsk.
          </Box>
        </Box>
        <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={CompanyImg}
            alt="Company Image"
            width='500px'
          />
        </Box>
      </Box>

      {/* Section 2 : Special notices */}
      {loading || notices == null ? (
        ''
      ) : (
        <>
          <Box component='div'
            sx={{
              backgroundImage: `url(${Section2Img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              padding: '2rem 0'
            }}>
            <Box component='h1' sx={{ fontSize: '2.5rem', textAlign: 'center', mb: '1rem' }}>Special Notices</Box>
            <Box component="div" sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {notices && notices.map((notice, index) => (
                <Paper elevation={3} component="div" key={index}
                  sx={{
                    border: '1px gray solid',
                    padding: '1rem',
                    margin: '0.7rem 3rem',
                    backgroundColor: 'white',
                    width: '600px'
                  }}
                >
                  <Box component="p" sx={{ fontWeight: '800' }}>{notice.title}</Box>
                  <Box component="p">{notice.description}</Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </>
      )}


      <img
        src={HeroImage}
        alt="Logo"
      />

<Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#3f51b5', color: 'white' }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Company
                        </Typography>
                        <Typography variant="body1">
                        Creative Freight Way Logistics Pvt Ltd
                        </Typography>
                        <Typography variant="body2">
                            Address: 25A/1 , Thoranawila junction, Makandana, Kesbewa, Piliyandala, Colombo, Sri Lanka
                        </Typography>
                        <Typography variant="body2">
                            Phone: +94 71 205 5774
                        </Typography>
                        <Typography variant="body2">
                            Email: creativefreightwaylogistics@gmail.com
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Links
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            Home
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            About Us
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            Services
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            Contact
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Follow Us
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            Facebook
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            Twitter
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            LinkedIn
                        </Typography>
                        <Typography variant="body2" sx={{cursor:'pointer'}}>
                            Instagram
                        </Typography>
                    </Grid>
                </Grid>
                <Box textAlign="center" pt={5} pb={2}>
                    <Typography variant="body2" color="inherit">
                        © {new Date().getFullYear()} GP solutions. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    </div>
    
  )
}