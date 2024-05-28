import { Box, Button } from '@mui/material';
import React from 'react';


const CustomerDetailsCard = ({ customer }) => {
  return (
    <Box component="div"
      sx={{
        width: '50%',
        height: '7rem',
        border: '2px solid',
        marginTop: '0.75rem',
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
      <div>
        <div className="">Customer ID: {customer.customer_id}</div>
        <div className="">Name: {customer.f_name} {customer.l_name}</div>
        <div className="">Tel number: 0{customer.tel_number}</div>
      </div>
      <Box component="div"
        sx={{
          color: '#3B82F6', // Blue-500 in Tailwind is equivalent to this color
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        {customer.order_count} active order
      </Box>
      <div>
        <Box component="div"
          sx={{
            color: '#3b82f6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '100%',
            textDecoration: 'underline'
          }}
        >
          {/* <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>New order</Button> */}
          <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>Edit</Button>
          {/* <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>Delete</Button> */}
          <Button sx={{ fontSize: '0.8rem', padding: '0.1rem' }}>History</Button>
        </Box>
      </div>
    </Box>
  )
}

export default CustomerDetailsCard
