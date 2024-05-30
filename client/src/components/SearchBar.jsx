import { Box, Button, TextField } from '@mui/material';
import React from 'react';

const SearchBar = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <TextField
        variant="outlined"
        placeholder="Search"
        sx={{ mr: 2 }}
        size='small'
      />
      <Button
        variant="contained"
        sx={{ backgroundColor: '#68DD62', '&:hover': { backgroundColor: '#45a049' } }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
