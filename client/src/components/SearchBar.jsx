import { Box, Button, TextField } from '@mui/material';
import React from 'react';

//search bar
const SearchBar = ({label,search,setSearch}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">

      {/* Search field */}
      <TextField
        variant = "outlined"
        placeholder= {label}
        sx = {{ mr: 2 }}
        size='small'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Search button */}
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
