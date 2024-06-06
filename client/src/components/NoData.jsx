import { Box } from '@mui/material';
import React from 'react';
import nodataImg from './../assets/nodata.png';

const NoDataComponent = ({message}) => {
  return (
    <>
      <Box component="div" sx={{margin:'auto',display: 'flex', justifyContent: 'center'}}>
        <img src={nodataImg} alt='empty image' style={{ width: '25rem'}} />
        </Box>
        <Box component="h5" sx={{width:'200px', margin:'auto', fontSize:'20px', fontWeight:'600', textAlign:'center'}}>{message}</Box>
    </>
  );
};

export default NoDataComponent;
